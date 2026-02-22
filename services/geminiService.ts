import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";
import { MetricsService } from "./metricsService";

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
6.0 THE BACK
6-0 ESCAPING THE BACK
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
A. CLOSED GUARD AGAINST KNEELING OPPONENT
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
B. CLOSED GUARD AGAINST STANDING OPPONENT
16-0 FRUSTRATING STANDING BASE
16-1 HIP PUSH SWEEP
16-2 CLASSIC UNDERHOOK SWEEP
16-3 ROLLOUT AGAINST UNDERHOOK DEFENSE
16-4 COMMON MISCONCEPTIONS
17.0 GUARD PASS DEFENSE
A. UNDER-THE-LEG PASS DEFENSE
17-1 SINGLE UNDER-THE-LEG PASS DEFENSE
17-2 DOUBLE UNDER-THE-LEGS DEFENSE TO SWEEP
B. OVER-THE-LEGS PASS DEFENSE
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
A. PASSING THE CLOSED GUARD FROM THE KNEES
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
B. PASSING THE GUARD FROM STANDING
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

/**
 * Extracts frames from the video in the browser to avoid full video upload.
 * OPTIMIZATION: Reduced to 9 frames to save ~25% tokens while maintaining temporal coverage.
 */
const extractFramesFromVideo = async (videoBlob: Blob, numFrames: number = 9): Promise<string[]> => {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const frames: string[] = [];

  const videoUrl = URL.createObjectURL(videoBlob);
  video.src = videoUrl;
  video.muted = true;
  video.playsInline = true;

  // Wait for metadata to load to know duration
  await new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(true);
  });

  const duration = video.duration;
  const interval = duration / numFrames;

  // Max 360px is optimal for 'Flash' models (balance of detail vs token cost)
  const scale = Math.min(360 / video.videoWidth, 1);
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
      // Quality 0.4 - Sufficient for pose detection, saves bandwidth
      const base64 = canvas.toDataURL('image/jpeg', 0.4).split(',')[1];
      frames.push(base64);
    }
  }

  URL.revokeObjectURL(videoUrl);
  return frames;
};

export const analyzeBJJVideo = async (videoBlob: Blob, signal?: AbortSignal): Promise<AnalysisResult> => {
  // Client initialization using env var
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // 1. Extract Frames (9 frames, 512px)
    const frames = await extractFramesFromVideo(videoBlob, 9);

    // 2. Build Multimodal Content
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
   - "reference": Object with "book", "technique" (exact Section ID + Name from TOC), "belt" (belt level), "quote" (key concept from the book)
   - "youtube_query": Optimized YouTube search query for this fighter's technique (e.g. "BJJ mount escape elbow technique tutorial")

IMPORTANT: Each fighter gets their OWN independent analysis, reference, and youtube_query.
Respond ONLY in valid JSON.`
      }
    ];
    // 3. MODEL INFERENCE WITH RETRY & FALLBACK
    // User requested 'gemini-3-flash-preview' as primary.
    const modelsToTry = ['gemini-3-flash-preview', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
    let lastError: any;

    for (const modelName of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        if (signal?.aborted) {
          throw new Error("Analysis cancelled by user");
        }

        try {
          console.log(`🤖 Predicting with ${modelName} (Attempt ${attempts + 1}/${maxAttempts})...`);

          const startTime = performance.now();
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: promptParts,
              role: 'user'
            },
            config: {
              systemInstruction: {
                parts: [{ text: JIU_JITSU_UNIVERSITY_CONTEXT }]
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

          // 📊 METRICS & SUCCESS
          const duration = performance.now() - startTime;
          const usage = response.usageMetadata;

          if (usage) {
            console.log("🔥 TOKEN CONSUMPTION:", usage);
            console.log(`💰 Perf: ${duration.toFixed(0)}ms`);
            MetricsService.logAnalysis(duration, usage.promptTokenCount, usage.candidatesTokenCount, modelName);

            // 📈 LOG AVERAGE TIME FOR USER
            const stats = MetricsService.getSummary();
            if (stats) console.log(`⏱️ AVERAGE ANALYSIS TIME: ${stats.avgLatency} (Samples: ${stats.totalRuns})`);
          }

          const jsonText = response.text;
          if (!jsonText) throw new Error("Gemini response was empty");

          try {
            return JSON.parse(jsonText) as AnalysisResult;
          } catch (e: any) {
            MetricsService.logError("JSON Parse", e.message);
            throw e; // Retry on parse error? Maybe not.
          }

        } catch (error: any) {
          console.warn(`⚠️ Attempt ${attempts + 1} failed on ${modelName}:`, error.message);
          lastError = error;

          // Check if retriable (429 or 503)
          if (error.message?.includes('429') || error.message?.includes('exhausted') || error.message?.includes('503')) {
            attempts++;
            if (attempts < maxAttempts) {
              // 🧠 Smart Wait: Extract suggested wait time from error message
              const match = error.message.match(/retry in (\d+(\.\d+)?)s/);
              const apiWaitTime = match ? parseFloat(match[1]) * 1000 : 0;

              // Use the larger of: API suggestion OR Exponential Backoff (2s, 4s, 8s)
              const backoffTime = Math.pow(2, attempts) * 2000;
              const finalWaitTime = Math.max(apiWaitTime, backoffTime);

              console.log(`⏳ Quota hit. Waiting ${(finalWaitTime / 1000).toFixed(1)}s before retry...`);
              await new Promise(resolve => setTimeout(resolve, finalWaitTime));
              continue; // Retry loop
            }
          } else {
            // Non-retriable error (e.g. 400 Bad Request), break inner loop and try next model?
            // Actually usually 400 means prompt was bad, so next model won't help. But let's try just in case.
            break;
          }
        }
      } // End while attempts
    } // End for models

    // If we get here, all models/retries failed
    MetricsService.logError("Final Failure", lastError?.message);
    if (lastError?.message?.includes('429')) {
      throw new Error("Server is busy (Quota Exceeded). Please wait 30 seconds and try again.");
    }
    throw lastError;

  } catch (err: any) {
    // Catch-all for top level errors
    throw err;
  }
};
