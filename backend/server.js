import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { DB } from './db.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup
app.use(cors());

// Configure body parsing limits (60mb for 50mb PDF base64 payloads)
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Get API Key from environment loaded via dotenv
const getApiKey = () => {
  return process.env.VITE_API_KEY || process.env.API_KEY || '';
};

// ═══════════════════════════════════════════════════════════════════
// BIBLIOGRAPHIC REFERENCE
// Ribeiro, S. & Howell, K. (2008). Jiu-Jitsu University.
// Victory Belt Publishing. ISBN: 978-0-9815044-2-9.
// ═══════════════════════════════════════════════════════════════════
const JIU_JITSU_UNIVERSITY_CONTEXT = `
ROLE: Saulo Ribeiro. Book: "Jiu-Jitsu University" (ISBN: 978-0-9815044-2-9).
MINDSET: White=Survival, Blue=Escapes, Purple=Guard, Brown=Passing, Black=Subs.

TOC (Reference these Section IDs EXACTLY):
[WHITE BELT - SURVIVAL]
1.0 THE BACK
1-0 THE BACK SURVIVAL POSITION
1-1 HAND FIGHTING
1-2 THE SCOOP
1-3 COMMON MISCONCEPTIONS
2.0 ALL-FOURS
2-0 SURVIVING ALL-FOURS BACK POSITION
2-1 SOLO ALL-FOURS SURVIVAL
2-2 ALL-FOURS SURVIVAL DRILL
2-3 ALL-FOURS DETAIL
2-4 ROLLING TO BACK SURVIVAL
2-5 COMMON MISCONCEPTIONS
3.0 THE MOUNT
3-0 SURVIVING THE MOUNT
3-1 SOLO MOUNT SURVIVAL DRILL
3-2 EARLY POSTURE
3-3 NULLIFYING THE CHOKE
3-4 ERROR IN CHOKE SURVIVAL
3-5 SEATED MOUNT SURVIVAL
3-6 COMMON MISCONCEPTIONS
4.0 SIDE CONTROL
4-0 SIDE CONTROL SURVIVAL
4-1 BLOCKING THE CROSS-FACE
4-2 RELEASING THE HAND
4-3 KESA GATAME HAND FIGHTING
4-4 REVERSE KESA GATAME
4-5 COMMON MISCONCEPTIONS
5.0 KNEE-ON-BELLY
5-0 KNEE-ON-BELLY SURVIVAL
5-1 SOLO KNEE-ON-BELLY PREVENTION
5-2 STRAIGHT-LEGGED PREVENTION
5-3 IMPORTANCE OF PREVENTION
5-4 RUNNING SURVIVAL POSTURE
5-5 EXPOSED ROLL
5-6 COMMON MISCONCEPTIONS
6.0 ESCAPING THE BACK
6-1 COMMON MISTAKE
6-2 BODY LOCK ESCAPE
6-3 ESCAPING DOUBLE-UNDERHOOK CONTROL
6-4 ESCAPING ALL-FOURS DRILL

[BLUE BELT - ESCAPES]
7.0 THE MOUNT
7-0 SOLO MOUNT ELBOW ESCAPE DRILL
7-1 MOUNT ELBOW ESCAPE
7-2 SEATED MOUNT ESCAPE
8.0 SIDE CONTROL
8-0 SOLO SIDE CONTROL DRILLS
8-1 SIDE CONTROL TO GUARD RECOVERY
8-2 SIDE CONTROL ESCAPE TO THE KNEES
8-3 SIDE CONTROL RUNNING ESCAPE
8-4 ESCAPE FROM KESA GATAME
8-5 ESCAPE FROM REVERSE KESA GATAME
8-6 ESCAPE AGAINST WRESTLER’S PIN
9.0 KNEE-ON-BELLY
9-0 KNEE-ON-BELLY RUNNING ESCAPE
10.0 ARMBAR
10-0 ARMBAR ESCAPE MOVEMENT DRILL
10-1 COMMON MISCONCEPTIONS
10-2 ARMBAR ESCAPE TO GUARD PASS
10-3 ARMBAR ESCAPE TO GUARD PASS 2
10-4 ARMBAR ESCAPE FROM BOTTOM
11.0 TRIANGLE
11-0 TRIANGLE ESCAPE TO PASS
11-1 COMMON MISCONCEPTIONS
12.0 GUILLOTINE
12-0 CLASSIC GUILLOTINE ESCAPE
12-1 ARM-IN GUILLOTINE ESCAPE
13.0 FOOTLOCK
13-0 SOLO FOOTLOCK ESCAPE DRILL
13-1 FOOTLOCK ESCAPE FROM GUARD
14.0 KIMURA
14-0 KIMURA ESCAPE FROM HALF GUARD
14-1 KIMURA ESCAPE TO ARMBAR POSTURE

[PURPLE BELT - THE GUARD]
15-0 CLOSED GUARD ARM WRAP
15-1 SOLO ARM WRAP CHOKE TO STRAIGHT ARMLOCK
15-2 ARM WRAP CHOKE TO STRAIGHT ARMLOCK
15-3 CLOSED GUARD OVERWRAP
15-4 OVERWRAP TO BACK
15-5 SCISSOR / KNEE SHIELD
15-6 CLASSIC ARMBAR
15-7 ARMBAR TO CROSS CHOKE DRILL
15-8 BRABO CHOKE
15-9 CLASSIC TRIANGLE CHOKE
15-10 SOLO HIP BUMP SWEEP
15-11 HIP BUMP SWEEP
15-12 FLOWER SWEEP
16-0 FRUSTRATING STANDING BASE
16-1 HIP PUSH SWEEP
16-2 CLASSIC UNDERHOOK SWEEP
16-3 ROLLOUT AGAINST UNDERHOOK DEFENSE
16-4 COMMON MISCONCEPTIONS
17.0 GUARD PASS DEFENSE
17-1 SINGLE UNDER-THE-LEG PASS DEFENSE
17-2 DOUBLE UNDER-THE-LEGS DEFENSE TO SWEEP
17-3 LEG-SQUEEZE DEFENSE
17-4 FAILED LEG-SQUEEZE DEFENSE
17-5 OVER-AND-UNDER SMASH DEFENSE
17-6 FAILED OVER-AND-UNDER SMASH DEFENSE
17-7 SAME-SIDE KNEE BLOCK
17-8 FAILED SAME-SIDE KNEE BLOCK
17-9 KNEE-SLIDE BLOCK
17-10 EARLY TORREANDO GRIP BREAK
17-11 COLLAR DRAG OFF TORREANDO DEFENSE
17-12 ANKLE PICK OFF TORREANDO DEFENSE
17-13 LATE TORREANDO BLOCK
17-14 TWO-HANDED TORREANDO BLOCK
17-15 STRAIGHT ARMLOCK
17-16 OMOPLATA OFF STRAIGHT ARMLOCK
18-0 BUTTERFLY GUARD
18-1 CONTROL AND DISTANCE
18-2 CONTROL AND MOVEMENT
18-3 SOLO BUTTERFLY SWEEP
18-4 CLASSIC BUTTERFLY SWEEP
18-5 FAILED BUTTERFLY SWEEP
18-6 WING SWEEP
18-7 STRAIGHT ARMLOCK DRILL
18-8 CLASSIC CROSS-CHOKE
18-9 PALM UP-PALM DOWN CHOKE
19-0 SPIDER GUARD
19-1 CONTROL AND MOVEMENT
19-2 FAILED CONTROL AND MOVEMENT
19-3 SWEEP OFF A PASS
20-0 CROSS-GRIP GUARD
20-1 POSTURE
20-2 FAILED POSTURE
20-3 CLASSIC TRIPOD SWEEP
20-4 CROSS-GRIP BACKROLL SWEEP
21-0 DE LA RIVA
21-1 STARTING POSITION
21-2 POSTURE BLOCKED
21-3 ROLLOVER SWEEP
21-4 DE LA RIVA TO TOMOE-NAGE SWEEP
22-0 SIT-UP GUARD
22-1 POSTURE DRILL
22-2 SIT-UP GUARD TO CLASSIC SWEEP
22-3 REVERSE ROLL SWEEP
22-4 FAILED REVERSE ROLL SWEEP
23-0 REVERSE DE LA RIVA GUARD
23-1 POSITIONING
23-2 REVERSE DE LA RIVA DRILL
23-3 FAILED POSITIONING
23-4 KNEE PUSH SWEEP
24-0 HALF GUARD
24-1 REGAINING GUARD OR CONTROL
24-2 IMPROPER CONTROL
24-3 DEEP CONTROL
24-4 GETTING EVEN DEEPER
24-5 BACKDOOR TO BACK
24-6 BOTTOM ARMLOCK - KIMURA
24-7 INCORRECT KIMURA

[BROWN BELT - PASSING]
25-0 BLOCKING THE COLLAR GRIP
25-1 DEFEATING THE CROSS-COLLAR GRIP
25-2 OVERHOOK GUARD ESCAPE
25-3 ESCAPING OVER-THE-SHOULDER BELT GRIP
25-4 CLASSIC OPENING ON THE KNEES
25-5 BLOCKING THE TRIANGLE
25-6 FAILED TRIANGLE BLOCK
25-7 OPENING WHEN OPPONENT HIDES BOTH ARMS
25-8 BASIC SINGLE UNDERHOOK OPENING
25-9 BASIC UNDERHOOK PASS
25-10 BEATING THE BLOCKED HIP
25-11 BASIC UNDERHOOK PASS VARIATION
25-12 DOUBLE UNDERHOOK PASS
25-13 DOUBLE UNDERHOOK PASS VARIATION
25-14 COMBAT BASE TO BASIC PASS
25-15 BASE WARM-UP
25-16 STANDING CORRECTLY VS. INCORRECTLY
25-17 STANDING OPENING WITH HIP PRESSURE
25-18 DEFENSIVE SQUATTING & STANDING OPEN
25-19 OPEN WHEN OPPONENT HIDES ONE ARM
25-20 OPEN AGAINST LONG LEGS
25-21 ARMPIT GRIP OPENING & BRIDGE DEFEATING
25-22 OPENING AGAINST DOUBLE UNDERHOOKS
26-0 CORE OPEN GUARD PASSES
26-1 LEG ROPE FRONT
26-2 LEG ROPE BACK
26-3 LEG ROPE SIDE SWITCH & SMASH
26-4 KNEE CROSS PASS
26-5 KNEE CROSS AGAINST LAPEL GRIP
26-6 ANGLE CHANGE TO KNEE PASS
26-7 TORREANDO & APPROACH
26-8 TORREANDO AGAINST ONE HOOK
26-9 TORREANDO W/ HIP CONTROL DRILL
26-11 TWO-ON-ONE LEG PASS
27-0 BUTTERFLY GUARD PASSES
27-1 POSTURE & BALANCE
27-2 FLAT BUTTERFLY–WALK-AROUND PASS
27-3 WALLID ISMAEL VARIATION
27-4 WRAP-THE-LEGS PASS
27-5 HAND PLANT PASS
27-6 LEVEL CHANGE PASS
27-7 FORWARD KNEE-PRESS PASS
27-8 PASSING THE CROSS-GRIP
27-9 FLOATING HIP-SWITCH PASS
27-10 FLOATING HIP-SWITCH AGAINST PANT GRAB
27-11 THE STAR PASS
27-12 TRANSITION TO MOUNT OFF PASS
27-13 STAND-UP WHEEL PASS
27-14 X PASS
27-15 SHIN-TO-SHIN PASS
28-0 SPIDER GUARD PASSES
28-1 BREAK & PASS
28-2 LEG LASSO PASS
29-0 CROSS GRIP PASSES
29-1 SAME SIDE PASS
30-0 DE LA RIVA PASSES
30-1 UNLOCK & PASS
30-2 HOOK ESCAPE PASS
30-3 PASSING THE DEEP DE LA RIVA
31-0 SIT-UP GUARD
31-1 STEP-AROUND PASS
31-2 UNDERHOOK TO MOUNT
31-3 UNDERHOOK TO KNEE-UP-THE-MIDDLE VARIATION
32-0 REVERSE DE LA RIVA PASSES
32-1 HIP SMASH
32-2 FLOATING PASS
33-0 INVERTED GUARD PASSES
33-1 HIP PASS
33-2 DANGER OF CIRCLING
34-0 PASSING THE X-GUARD
34-1 BALANCE BALL BREAK & PASS
34-2 BREAK & PASS
35-0 HALF GUARD PASSES
35-1 FLATTENING THE OPPONENT
35-2 STRAIGHT LEG PASS WITH KNEE BLOCK
35-3 BASE-SWITCH PASS WITH SHIN
35-4 BLOCKED ARM PASS
35-5 XANDE’S FLATTENING PASS
35-6 SHIN SLIDE PASS
35-7 ESGRIMA PASS
35-8 ESGRIMA MOUNT
35-9 FREDSON ALVES’ ESGRIMA PASS
35-10 WHIZZER ARMBAR FEINT PASS
35-11 THE OPPOSITE SIDE PASS
35-12 OPPOSITE PASS AGAINST UNDERHOOK
35-13 OPPOSITE-SIDE PASS TO MOUNT
35-14 HALF MOUNT PASS
35-15 HALF MOUNT TO KNEE CROSS
35-16 DEEP HALF—LEG PULLOUT
35-17 HALF BUTTERFLY HIP-SWITCH
35-18 OPEN HALF GUARD HIP-DRIVE PASS
35-19 OPEN HALF GUARD LEMON SQUEEZE PASS

[BLACK BELT - SUBMISSIONS]
36-0 THE BACK
36-1 GETTING THE COLLAR: BOW & ARROW CHOKE
36-2 ARMBAR AGAINST CHOKE DEFENSE
36-3 ARM & COLLAR CHOKE
36-4 EZEQUIEL CHOKE FROM THE BACK
37-0 THE MOUNT
37-1 THE AMERICANA
37-2 MOUNTED ARMBAR
37-3 EZEQUIEL
37-4 KATA GATAME
37-5 PALM UP/PALM DOWN CHOKE
37-6 PALM UP/PALM UP CHOKE
37-7 TRIANGLE CHOKE
37-8 S-MOUNT CROSS CHOKE
37-9 S-MOUNT ARMBAR
37-10 KATA GATAME TO EZEQUIEL
37-11 COLLAR CHOKE DRILL
38-0 SIDE CONTROL
38-1 KIMURA
38-2 WALK-AROUND ARMBAR
38-3 ROYLER’S ARMBAR
38-4 SPINNING ARMBAR
38-5 FAILED SPINNING ARMBAR
38-6 SPINNING ARMBAR TO KIMURA
38-7 STEP-OVER CHOKE
38-8 BREAD CUTTER CHOKE
38-9 BASEBALL CHOKE
39-0 TURTLE TOP
39-1 CLOCK CHOKE
40-0 HALF GUARD
40-1 BRABO CHOKE
40-2 BRABO TO STRAIGHT ARMLOCK
41-0 GUARD TOP
41-1 STRAIGHT ANKLE LOCK

TASK: Identify technique. Compare mechanics vs Saulo's book logic. 
Tips: Concise (Max 3).
Reference: STRICT JSON format.
`;

// Helper: Compile RAG context from the server DB
async function compileRagContext() {
  try {
    const validated = await DB.sources.getValidated();
    if (validated.length === 0) {
      return "No user library context uploaded. Rely on standard BJJ methodology and general knowledge.";
    }

    return validated.map((s, idx) => {
      return `[Source #${idx + 1}]
Name: ${s.name}
Type: ${s.type}
Techniques Covered: ${s.techniquesCovered.join(', ')}
Summary of context/instructions:
${s.contentSummary}`;
    }).join('\n\n===========================================\n\n');
  } catch (e) {
    console.error("Error compiling RAG context:", e);
    return "";
  }
}

// Helper: Gemini model calls for validation and resource adaptation
async function validateBJJSource(type, sourceData) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key is missing on the server backend.");

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash-lite';
  let parts = [];

  if (type === 'pdf' && sourceData.base64Pdf) {
    parts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: sourceData.base64Pdf
      }
    });
    parts.push({
      text: `Analyze this PDF document.
Validate if it is primarily related to Brazilian Jiu-Jitsu (BJJ), Grappling, Judo, or sparring techniques.
If NOT related to BJJ, return JSON:
{
  "valid": false,
  "name": "",
  "summary": "",
  "techniques": [],
  "reason": "Explain briefly why the document is not related to BJJ."
}

If YES, it is related, analyze the content and return JSON:
{
  "valid": true,
  "name": "The actual title or a descriptive name of the document",
  "summary": "A concise 2-3 sentence summary of the core BJJ techniques, strategies, or concepts detailed in this file.",
  "techniques": ["Technique Name 1", "Technique Name 2"]
}

Respond ONLY in valid JSON.`
    });
  } else {
    parts.push({
      text: `Analyze this YouTube video information:
URL: ${sourceData.url}
Title: ${sourceData.title || 'Unknown YouTube Video'}

Validate if the video title and context are related to Brazilian Jiu-Jitsu (BJJ), Grappling, submission wrestling, or BJJ martial arts training.
If NOT related to BJJ, return JSON:
{
  "valid": false,
  "name": "",
  "summary": "",
  "techniques": [],
  "reason": "Explain briefly why this video is not related to BJJ."
}

If YES, it is related, analyze the details and return JSON:
{
  "valid": true,
  "name": "The title of the video",
  "summary": "A brief summary of what technique is likely covered in this video based on the title and BJJ knowledge.",
  "techniques": ["Technique Name 1"]
}

Respond ONLY in valid JSON.`
    });
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts, role: 'user' },
    config: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("Gemini validation response was empty");
  return JSON.parse(jsonText);
}

async function adaptLearningResource(techniqueName, currentQuery, mistakes) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key is missing on the server backend.");

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash-lite';

  const prompt = `The BJJ student is struggling to learn the technique: "${techniqueName}".
Their current study YouTube query was: "${currentQuery}".
During their sparring video audits, they made the following mistakes:
${mistakes.map(m => `- ${m}`).join('\n')}

They are NOT learning successfully from the current information. 
You need to adapt and change their learning path:
1. Generate a NEW, different, highly optimized YouTube search query that targets alternative instructionals, troubleshooting details, details on framing/leverage, or specific adjustments for this technique (e.g. if the query was "half guard pass", and they fail due to "opponent locking the knee underhook", change to "how to defeat underhook half guard pass BJJ" or "troubleshooting half guard pass knee slice"). Make sure the query ends with "BJJ".
2. Provide a short reasoning statement explaining why this change was made and what specific biomechanical adjustment they should focus on.

Return your response in this exact JSON schema:
{
  "newQuery": "The adapted YouTube search query",
  "reasoning": "A 1-2 sentence explanation of the change and advice for the student."
}

Respond ONLY in valid JSON.`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts: [{ text: prompt }], role: 'user' },
    config: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("Gemini adaptation response was empty");
  return JSON.parse(jsonText);
}

// Helper: Track sparring results and update progress stats
async function trackSparringAudit(fighters) {
  let adaptedCount = 0;
  for (const fighter of fighters) {
    const status = fighter.status;
    const mistakes = fighter.mistakes;

    for (const techName of fighter.techniques) {
      const normalizedName = techName.trim();
      if (!normalizedName) continue;

      let progress = await DB.progress.get(normalizedName);

      if (!progress) {
        progress = {
          techniqueName: normalizedName,
          status: status === 'approved' ? 'mastered' : 'learning',
          attemptsCount: 1,
          successRate: status === 'approved' ? 100 : 0,
          lastObservedStatus: status,
          lastAttemptTimestamp: Date.now(),
          mistakesHistory: mistakes,
          assignedVideoQuery: `${normalizedName} BJJ tutorial technique`,
          adaptationVersion: 0
        };
        await DB.progress.save(progress);
      } else {
        const prevAttempts = progress.attemptsCount;
        const newAttempts = prevAttempts + 1;
        const isApproved = status === 'approved';
        const currentSuccess = isApproved ? 100 : 0;
        const newSuccessRate = Math.round(((progress.successRate * prevAttempts) + currentSuccess) / newAttempts);
        const updatedMistakes = Array.from(new Set([...progress.mistakesHistory, ...mistakes]));

        let shouldAdapt = false;
        let newQuery = progress.assignedVideoQuery;
        let reasoning = progress.recommendationReasoning || '';

        if (progress.lastObservedStatus === 'correction_needed' && status === 'correction_needed') {
          shouldAdapt = true;
        }

        if (shouldAdapt) {
          try {
            console.log(`Adapting learning resource for: ${normalizedName}`);
            const result = await adaptLearningResource(normalizedName, progress.assignedVideoQuery, mistakes);
            await DB.logs.add({
              techniqueName: normalizedName,
              previousQuery: progress.assignedVideoQuery,
              newQuery: result.newQuery,
              reason: result.reasoning
            });
            newQuery = result.newQuery;
            reasoning = result.reasoning;
            progress.adaptationVersion += 1;
            adaptedCount++;
          } catch (e) {
            console.error(`Failed to adapt resource for ${normalizedName}:`, e);
          }
        }

        let newStatus = 'learning';
        if (newSuccessRate >= 80 && status === 'approved') {
          newStatus = 'mastered';
        }

        progress = {
          ...progress,
          attemptsCount: newAttempts,
          successRate: newSuccessRate,
          lastObservedStatus: status,
          lastAttemptTimestamp: Date.now(),
          mistakesHistory: updatedMistakes,
          assignedVideoQuery: newQuery,
          recommendationReasoning: reasoning,
          status: newStatus
        };
        await DB.progress.save(progress);
      }
    }
  }
  return adaptedCount;
}

// API Routes

// --- History API ---
app.get('/api/history', async (req, res) => {
  const history = await DB.history.getAll();
  res.json(history.reverse()); // Return newest first
});

app.post('/api/history', async (req, res) => {
  const id = await DB.history.save(req.body);
  res.json({ id });
});

app.delete('/api/history/:id', async (req, res) => {
  const success = await DB.history.delete(req.params.id);
  res.json({ success });
});

// --- RAG Sources API ---
app.get('/api/rag/sources', async (req, res) => {
  const sources = await DB.sources.getAll();
  res.json(sources);
});

app.post('/api/rag/sources', async (req, res) => {
  const id = await DB.sources.save(req.body);
  res.json({ id });
});

app.delete('/api/rag/sources/:id', async (req, res) => {
  const success = await DB.sources.delete(req.params.id);
  res.json({ success });
});

// --- Learning Progress and Logs API ---
app.get('/api/rag/progress', async (req, res) => {
  const progress = await DB.progress.getAll();
  res.json(progress);
});

app.get('/api/rag/logs', async (req, res) => {
  const logs = await DB.logs.getAll();
  res.json(logs);
});

// --- Validation and Adaptation ---
app.post('/api/validate', async (req, res) => {
  const { type, sourceData } = req.body;
  try {
    const result = await validateBJJSource(type, sourceData);
    res.json(result);
  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- System Reset ---
app.post('/api/reset', async (req, res) => {
  try {
    await DB.clearAll();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Sparring Technical Audit (RAG Injected) ---
app.post('/api/audit', async (req, res) => {
  const { frames } = req.body;
  if (!frames || !Array.isArray(frames)) {
    return res.status(400).json({ error: 'Frames array is required' });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API Key is not set on the backend server.' });
  }

  try {
    // 1. Compile central RAG context
    const ragContext = await compileRagContext();

    // 2. Build Gemini Multimodal Content
    const promptParts = [
      ...frames.map(frameData => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: frameData
        }
      })),
      {
        text: `Analyze this BJJ sparring video. There are EXACTLY 2 fighters.

INSTRUCTIONS:
1. Identify each fighter by visual cues (gi color, position: top/bottom, etc.).
2. Return a "fighters" array with EXACTLY 2 objects — one per fighter.
3. For EACH fighter, provide:
   - "role": Descriptive label (e.g. "Top Fighter (White Gi)", "Bottom Fighter (Blue Gi)")
   - "status": "approved" if technique is correct, "correction_needed" if flawed
   - "summary": 1-2 sentence analysis of what this fighter is doing
   - "techniques": Array of techniques observed (max 3)
   - "mistakes": Array of biomechanical errors (max 3, empty if none)
   - "tips": Array of improvement tips from Saulo Ribeiro's methodology (max 3)
   - "reference": Object with "book", "technique" (exact Section ID + Name from TOC or RAG context), "belt" (belt level or "RAG Library"), "quote" (key concept or quote)
   - "youtube_query": Optimized YouTube search query for this fighter's technique (e.g. "BJJ mount escape elbow technique tutorial")

IMPORTANT: Each fighter gets their OWN independent analysis, reference, and youtube_query.
Respond ONLY in valid JSON.`
      }
    ];

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: { parts: promptParts, role: 'user' },
      config: {
        systemInstruction: {
          parts: [{ 
            text: `${JIU_JITSU_UNIVERSITY_CONTEXT}\n\n=========================================\nADDITIONAL USER-PROVIDED LIBRARY CONTEXT (RAG):\n${ragContext}\n\nINSTRUCTION: First, prioritize identifying if the techniques performed match any source in the user's RAG library context above. If they match, references should reference that source's name and details (e.g. book = Source Name, technique = Technique Name, belt = "RAG Library", quote = summary or key instruction). Otherwise, default to the Jiu-Jitsu University book or general BJJ methodology.`
          }]
        },
        temperature: 0.1,
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
                      technique: { type: Type.STRING },
                      belt: { type: Type.STRING },
                      quote: { type: Type.STRING }
                    },
                    required: ["book", "technique", "belt", "quote"]
                  },
                  youtube_query: { type: Type.STRING }
                },
                required: ["role", "status", "summary", "techniques", "mistakes", "tips", "reference", "youtube_query"]
              }
            }
          },
          required: ["fighters"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Gemini response was empty");
    const result = JSON.parse(jsonText);

    // 3. Track progress and adapt queries dynamically
    await trackSparringAudit(result.fighters);

    // 4. Save analysis results to the central history db
    const historyId = await DB.history.save(result);
    result.id = historyId;
    result.timestamp = Date.now();

    res.json(result);
  } catch (err) {
    console.error("Audit processing failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 OpenBJJ Backend Server running on http://localhost:${PORT}`);
});
