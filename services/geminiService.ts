
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Contexto optimizado: Eliminamos la tabla de contenidos gigante.
// El modelo ya conoce el libro, solo necesitamos reforzar la "personalidad" y los principios.
const JIU_JITSU_UNIVERSITY_CONTEXT = `
ROL: Actúa como Saulo Ribeiro, leyenda del BJJ y autor de "Jiu-Jitsu University".

FILOSOFÍA (MENTALIDAD SAULO):
1. SUPERVIVENCIA (Blanco): "Si piensas, llegas tarde. Si llegas tarde, usas fuerza. Si usas fuerza, te cansas. Si te cansas, mueres." Tu prioridad es NO perder.
2. ESCAPES (Azul): El escape nace de la supervivencia. Usa la palanca, no la fuerza.
3. GUARDIA (Morado): La guardia son las caderas. Sin movimiento de cadera, no hay guardia.
4. PASES (Marrón): Gravedad + Tú vs. Oponente.
5. SUMISIONES (Negro): El camino final. Precisión quirúrgica.

TU OBJETIVO:
Analizar una secuencia de imágenes de un sparring (rolling) y diagnosticar la técnica. Sé directo, duro pero educativo, como un coach campeón mundial.
`;

/**
 * Extrae frames del video en el navegador para evitar subir el archivo pesado.
 * Esto reduce el tiempo de inferencia de minutos a segundos.
 */
const extractFramesFromVideo = async (videoBlob: Blob, numFrames: number = 12): Promise<string[]> => {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const frames: string[] = [];

  const videoUrl = URL.createObjectURL(videoBlob);
  video.src = videoUrl;
  video.muted = true;
  video.playsInline = true;

  // Esperar a que cargue la metadata para saber la duración
  await new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(true);
  });

  const duration = video.duration;
  const interval = duration / numFrames;

  const scale = Math.min(512 / video.videoWidth, 1);
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;

  for (let i = 0; i < numFrames; i++) {
    const currentTime = i * interval;
    video.currentTime = currentTime;

    await new Promise((resolve) => {
      video.onseeked = () => resolve(true);
    });

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.5).split(',')[1]; // Lower quality slightly for speed
      frames.push(base64);
    }
  }

  URL.revokeObjectURL(videoUrl);
  return frames;
};

export const analyzeBJJVideo = async (videoBlob: Blob): Promise<AnalysisResult> => {
  // Inicialización del cliente usando la variable de entorno
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // 1. Extraemos frames (Optimizado para latencia: 512px)
    const frames = await extractFramesFromVideo(videoBlob, 12);

    // 2. Construimos el contenido multimodal
    const promptParts = [
      ...frames.map(frameData => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: frameData
        }
      })),
      {
        text: `Analiza esta secuencia de video frames.
        CONTEXTO: ${JIU_JITSU_UNIVERSITY_CONTEXT}
        TAREA: Identifica luchadores, técnica, y evalúa biomecánica vs conceptos de Saulo.
        Responde SOLO en JSON.`
      }
    ];

    // 3. MODELO: 'gemini-2.0-flash' (Solicitado explícitamente y probado por usuario)
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: promptParts,
        role: 'user'
      },
      config: {
        temperature: 0.1,
        // Eliminamos googleSearch para reducir latencia (1-3s de ahorro)
        // tools: [{ googleSearch: {} }], 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fighters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["approved", "correction_needed"] },
                  summary: { type: Type.STRING },
                  techniques: { type: Type.ARRAY, items: { type: Type.STRING } },
                  mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reference: {
                    type: Type.OBJECT,
                    properties: {
                      book: { type: Type.STRING },
                      chapter: { type: Type.STRING },
                      page: { type: Type.STRING },
                      quote: { type: Type.STRING }
                    },
                    required: ["book", "chapter", "page", "quote"]
                  },
                  youtube_query: { type: Type.STRING }
                },
                required: ["role", "status", "summary", "techniques", "mistakes", "tips", "reference", "youtube_query"]
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const rawResult = JSON.parse(response.text);

      const result: AnalysisResult = {
        fighters: rawResult.fighters
      };

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        result.groundingSources = groundingChunks
          .filter(chunk => chunk.web?.uri && chunk.web?.title)
          .map(chunk => ({
            url: chunk.web!.uri!,
            title: chunk.web!.title!
          }));
      }

      return result;
    }

    throw new Error("Fallo en la inferencia del modelo.");

  } catch (error) {
    console.error("Error en auditoría técnica:", error);
    throw error;
  }
};
