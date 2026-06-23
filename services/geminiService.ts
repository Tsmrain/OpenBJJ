import { AnalysisResult } from "../types";

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

export const analyzeBJJVideo = async (videoBlob: Blob, ragContext: string = "", signal?: AbortSignal): Promise<AnalysisResult> => {
  try {
    // 1. Extract 9 frames locally in the browser
    const frames = await extractFramesFromVideo(videoBlob, 9);

    // 2. Delegate the heavy analysis to the Express backend (avoiding API keys in browser)
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ frames }),
      signal
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Technical sparring audit failed on server.");
    }

    return await response.json() as AnalysisResult;
  } catch (err: any) {
    throw err;
  }
};

/**
 * Validates if an uploaded PDF file or YouTube link details are BJJ-related (delegated to backend).
 */
export const validateBJJSource = async (
  type: 'pdf' | 'youtube',
  sourceData: { base64Pdf?: string; url?: string; title?: string }
): Promise<{ valid: boolean; name: string; summary: string; techniques: string[]; reason?: string }> => {
  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, sourceData }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Validation failed on the server.");
    }

    return await response.json();
  } catch (e: any) {
    console.error("Gemini validation via server failed:", e);
    return {
      valid: false,
      name: sourceData.title || "Unknown source",
      summary: "",
      techniques: [],
      reason: `Validation error: ${e.message}`
    };
  }
};

/**
 * Generates an adapted study resource search query and reasoning (mocked client-side, done on server).
 */
export const adaptLearningResource = async (
  techniqueName: string,
  currentQuery: string,
  mistakes: string[]
): Promise<{ newQuery: string; reasoning: string }> => {
  // Now processed server-side automatically during sparring audit, but keep as fallback API client
  try {
    const response = await fetch('/api/adapt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ techniqueName, currentQuery, mistakes }),
    });
    if (!response.ok) throw new Error("Adaptation failed on server");
    return await response.json();
  } catch (err) {
    return {
      newQuery: `${techniqueName} troubleshooting details BJJ`,
      reasoning: `We adapted your search to focus on troubleshooting the details for ${techniqueName}.`
    };
  }
};
