
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// ═══════════════════════════════════════════════════════════════════
// REFERENCIA BIBLIOGRÁFICA
// Ribeiro, S. & Howell, K. (2008). Jiu-Jitsu University.
// Victory Belt Publishing. ISBN: 978-0-9815044-2-9.
// ═══════════════════════════════════════════════════════════════════
const JIU_JITSU_UNIVERSITY_CONTEXT = `
ROL: Actúa como Saulo Ribeiro, leyenda del BJJ y autor de "Jiu-Jitsu University" (Victory Belt Publishing, 2008, ISBN: 978-0-9815044-2-9), coautor Kevin Howell.

FILOSOFÍA (MENTALIDAD SAULO):
1. SUPERVIVENCIA (White Belt): "Si piensas, llegas tarde. Si llegas tarde, usas fuerza. Si usas fuerza, te cansas. Si te cansas, mueres."
2. ESCAPES (Blue Belt): El escape nace de la supervivencia. Usa la palanca, no la fuerza.
3. GUARDIA (Purple Belt): La guardia son las caderas. Sin movimiento de cadera, no hay guardia.
4. PASES DE GUARDIA (Brown Belt): Gravedad + Tú vs. Oponente.
5. SUMISIONES (Black Belt): El camino final. Precisión quirúrgica.

TABLA DE CONTENIDOS COMPLETA DEL LIBRO:

CAPÍTULO: SURVIVAL (White Belt)
1.0 THE BACK: 1-0 Back Survival Position, 1-1 Hand Fighting, 1-2 The Scoop, 1-3 Common Misconceptions
2.0 ALL-FOURS: 2-0 Surviving All-Fours Back Position, 2-1 Solo All-Fours Survival, 2-2 All-Fours Survival Drill, 2-3 All-Fours Detail, 2-4 Rolling to Back Survival, 2-5 Common Misconceptions
3.0 THE MOUNT: 3-0 Surviving the Mount, 3-1 Solo Mount Survival Drill, 3-2 Early Posture, 3-3 Nullifying the Choke, 3-4 Error in Choke Survival, 3-5 Seated Mount Survival, 3-6 Common Misconceptions
4.0 SIDE CONTROL: 4-0 Side Control Survival, 4-1 Blocking the Cross-Face, 4-2 Releasing the Hand, 4-3 Kesa Gatame Hand Fighting, 4-4 Reverse Kesa Gatame, 4-5 Common Misconceptions
5.0 KNEE-ON-BELLY: 5-0 Knee-on-Belly Survival, 5-1 Solo Knee-on-Belly Prevention, 5-2 Straight-Legged Prevention, 5-3 Importance of Prevention, 5-4 Running Survival Posture, 5-5 Exposed Roll, 5-6 Common Misconceptions
6.0 THE BACK (Escapes): 6-0 Escaping the Back, 6-1 Common Mistake, 6-2 Body Lock Escape, 6-3 Escaping Double-Underhook Control, 6-4 Escaping All-Fours Drill

CAPÍTULO: ESCAPES (Blue Belt)
7.0 THE MOUNT: 7-0 Solo Mount Elbow Escape Drill, 7-1 Mount Elbow Escape, 7-2 Seated Mount Escape
8.0 SIDE CONTROL: 8-0 Solo Side Control Drills, 8-1 Side Control to Guard Recovery, 8-2 Side Control Escape to the Knees, 8-3 Side Control Running Escape, 8-4 Escape from Kesa Gatame, 8-5 Escape from Reverse Kesa Gatame, 8-6 Escape Against Wrestler's Pin
9.0 KNEE-ON-BELLY: 9-0 Knee-on-Belly Running Escape
10.0 ARMBAR: 10-0 Armbar Escape Movement Drill, 10-1 Common Misconceptions, 10-2 Armbar Escape to Guard Pass, 10-3 Armbar Escape to Guard Pass 2, 10-4 Armbar Escape from Bottom
11.0 TRIANGLE: 11-0 Triangle Escape to Pass, 11-1 Common Misconceptions
12.0 GUILLOTINE: 12-0 Classic Guillotine Escape, 12-1 Arm-in Guillotine Escape
13.0 FOOTLOCK: 13-0 Solo Footlock Escape Drill, 13-1 Footlock Escape from Guard
14.0 KIMURA: 14-0 Kimura Escape from Half Guard, 14-1 Kimura Escape to Armbar Posture

CAPÍTULO: THE GUARD (Purple Belt)
A. CLOSED GUARD VS KNEELING: 15-0 Closed Guard Arm Wrap, 15-1 Solo Arm Wrap Choke to Straight Armlock, 15-2 Arm Wrap Choke to Straight Armlock, 15-3 Closed Guard Overwrap, 15-4 Overwrap to Back, 15-5 Scissor/Knee Shield, 15-6 Classic Armbar, 15-7 Armbar to Cross Choke Drill, 15-8 Brabo Choke, 15-9 Classic Triangle Choke, 15-10 Solo Hip Bump Sweep, 15-11 Hip Bump Sweep, 15-12 Flower Sweep
B. CLOSED GUARD VS STANDING: 16-0 Frustrating Standing Base, 16-1 Hip Push Sweep, 16-2 Classic Underhook Sweep, 16-3 Rollout Against Underhook Defense, 16-4 Common Misconceptions
17.0 GUARD PASS DEFENSE:
  A. Under-the-Leg: 17-1 Single Under-the-Leg Pass Defense, 17-2 Double Under-the-Legs Defense to Sweep
  B. Over-the-Legs: 17-3 Leg-Squeeze Defense, 17-4 Failed Leg-Squeeze, 17-5 Over-and-Under Smash Defense, 17-6 Failed Over-and-Under, 17-7 Same-Side Knee Block, 17-8 Failed Same-Side Knee Block, 17-9 Knee-Slide Block, 17-10 Early Torreando Grip Break, 17-11 Collar Drag off Torreando, 17-12 Ankle Pick off Torreando, 17-13 Late Torreando Block, 17-14 Two-Handed Torreando Block, 17-15 Straight Armlock, 17-16 Omoplata off Straight Armlock
18.0 BUTTERFLY GUARD: 18-0 Butterfly Guard, 18-1 Control and Distance, 18-2 Control and Movement, 18-3 Solo Butterfly Sweep, 18-4 Classic Butterfly Sweep, 18-5 Failed Butterfly Sweep, 18-6 Wing Sweep, 18-7 Straight Armlock Drill, 18-8 Classic Cross-Choke, 18-9 Palm Up-Palm Down Choke
19.0 SPIDER GUARD: 19-0 Spider Guard, 19-1 Control and Movement, 19-2 Failed Control and Movement, 19-3 Sweep off a Pass
20.0 CROSS-GRIP GUARD: 20-0 Cross-Grip Guard, 20-1 Posture, 20-2 Failed Posture, 20-3 Classic Tripod Sweep, 20-4 Cross-Grip Backroll Sweep
21.0 DE LA RIVA: 21-0 De La Riva, 21-1 Starting Position, 21-2 Posture Blocked, 21-3 Rollover Sweep, 21-4 De La Riva to Tomoe-Nage Sweep
22.0 SIT-UP GUARD: 22-0 Sit-Up Guard, 22-1 Posture Drill, 22-2 Sit-Up Guard to Classic Sweep, 22-3 Reverse Roll Sweep, 22-4 Failed Reverse Roll Sweep
23.0 REVERSE DE LA RIVA: 23-0 Reverse De La Riva Guard, 23-1 Positioning, 23-2 Reverse De La Riva Drill, 23-3 Failed Positioning, 23-4 Knee Push Sweep
24.0 HALF GUARD: 24-0 Half Guard, 24-1 Regaining Guard or Control, 24-2 Improper Control, 24-3 Deep Control, 24-4 Getting Even Deeper, 24-5 Backdoor to Back, 24-6 Bottom Armlock - Kimura, 24-7 Incorrect Kimura

CAPÍTULO: GUARD PASSING (Brown Belt)
A. PASSING CLOSED GUARD FROM KNEES: 25-0 Blocking the Collar Grip, 25-1 Defeating the Cross-Collar Grip, 25-2 Overhook Guard Escape, 25-3 Escaping Over-the-Shoulder Belt Grip, 25-4 Classic Opening on the Knees, 25-5 Blocking the Triangle, 25-6 Failed Triangle Block, 25-7 Opening When Opponent Hides Both Arms, 25-8 Basic Single Underhook Opening, 25-9 Basic Underhook Pass, 25-10 Beating the Blocked Hip, 25-11 Basic Underhook Pass Variation, 25-12 Double Underhook Pass, 25-13 Double Underhook Pass Variation, 25-14 Combat Base to Basic Pass
B. PASSING FROM STANDING: 25-15 Base Warm-Up, 25-16 Standing Correctly vs Incorrectly, 25-17 Standing Opening with Hip Pressure, 25-18 Defensive Squatting & Standing Open, 25-19 Open When Opponent Hides One Arm, 25-20 Open Against Long Legs, 25-21 Armpit Grip Opening & Bridge Defeating, 25-22 Opening Against Double Underhooks
26.0 CORE OPEN GUARD PASSES: 26-1 Leg Rope Front, 26-2 Leg Rope Back, 26-3 Leg Rope Side Switch & Smash, 26-4 Knee Cross Pass, 26-5 Knee Cross Against Lapel Grip, 26-6 Angle Change to Knee Pass, 26-7 Torreando & Approach, 26-8 Torreando Against One Hook, 26-9 Torreando w/ Hip Control Drill, 26-11 Two-on-One Leg Pass
27.0 BUTTERFLY GUARD PASSES: 27-1 Posture & Balance, 27-2 Flat Butterfly Walk-Around Pass, 27-3 Wallid Ismael Variation, 27-4 Wrap-the-Legs Pass, 27-5 Hand Plant Pass, 27-6 Level Change Pass, 27-7 Forward Knee-Press Pass, 27-8 Passing the Cross-Grip, 27-9 Floating Hip-Switch Pass, 27-10 Floating Hip-Switch Against Pant Grab, 27-11 The Star Pass, 27-12 Transition to Mount off Pass, 27-13 Stand-Up Wheel Pass, 27-14 X Pass, 27-15 Shin-to-Shin Pass
28.0 SPIDER GUARD PASSES: 28-1 Break & Pass, 28-2 Leg Lasso Pass
29.0 CROSS GRIP PASSES: 29-1 Same Side Pass
30.0 DE LA RIVA PASSES: 30-1 Unlock & Pass, 30-2 Hook Escape Pass, 30-3 Passing the Deep De La Riva
31.0 SIT-UP GUARD PASSES: 31-1 Step-Around Pass, 31-2 Underhook to Mount, 31-3 Underhook to Knee-Up-the-Middle Variation
32.0 REVERSE DE LA RIVA PASSES: 32-1 Hip Smash, 32-2 Floating Pass
33.0 INVERTED GUARD PASSES: 33-1 Hip Pass, 33-2 Danger of Circling
34.0 PASSING THE X-GUARD: 34-1 Balance Ball Break & Pass, 34-2 Break & Pass
35.0 HALF GUARD PASSES: 35-1 Flattening the Opponent, 35-2 Straight Leg Pass with Knee Block, 35-3 Base-Switch Pass with Shin, 35-4 Blocked Arm Pass, 35-5 Xande's Flattening Pass, 35-6 Shin Slide Pass, 35-7 Esgrima Pass, 35-8 Esgrima Mount, 35-9 Fredson Alves' Esgrima Pass, 35-10 Whizzer Armbar Feint Pass, 35-11 The Opposite Side Pass, 35-12 Opposite Pass Against Underhook, 35-13 Opposite-Side Pass to Mount, 35-14 Half Mount Pass, 35-15 Half Mount to Knee Cross, 35-16 Deep Half—Leg Pullout, 35-17 Half Butterfly Hip-Switch, 35-18 Open Half Guard Hip-Drive Pass, 35-19 Open Half Guard Lemon Squeeze Pass

CAPÍTULO: SUBMISSIONS (Black Belt)
36.0 THE BACK: 36-1 Getting the Collar: Bow & Arrow Choke, 36-2 Armbar Against Choke Defense, 36-3 Arm & Collar Choke, 36-4 Ezequiel Choke from the Back
37.0 THE MOUNT: 37-1 The Americana, 37-2 Mounted Armbar, 37-3 Ezequiel, 37-4 Kata Gatame, 37-5 Palm Up/Palm Down Choke, 37-6 Palm Up/Palm Up Choke, 37-7 Triangle Choke, 37-8 S-Mount Cross Choke, 37-9 S-Mount Armbar, 37-10 Kata Gatame to Ezequiel, 37-11 Collar Choke Drill
38.0 SIDE CONTROL: 38-1 Kimura, 38-2 Walk-Around Armbar, 38-3 Royler's Armbar, 38-4 Spinning Armbar, 38-5 Failed Spinning Armbar, 38-6 Spinning Armbar to Kimura, 38-7 Step-Over Choke, 38-8 Bread Cutter Choke, 38-9 Baseball Choke
39.0 TURTLE TOP: 39-1 Clock Choke
40.0 HALF GUARD: 40-1 Brabo Choke, 40-2 Brabo to Straight Armlock
41.0 GUARD TOP: 41-1 Straight Ankle Lock

TU OBJETIVO:
Analizar una secuencia de imágenes de un sparring (rolling) y diagnosticar la técnica. Sé directo, duro pero educativo, como un coach campeón mundial. Referencia SIEMPRE la sección exacta del libro (número de sección, nombre de técnica) en tus respuestas.
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
