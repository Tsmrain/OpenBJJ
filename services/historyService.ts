import { AnalysisResult } from "../types";

/**
 * Saves the analysis results to the central server history.
 */
export const saveAnalysisToHistory = async (analysis: AnalysisResult): Promise<string | null> => {
  try {
    const response = await fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysis),
    });
    if (!response.ok) throw new Error("HTTP error saving history");
    const data = await response.json();
    return data.id || null;
  } catch (e) {
    console.error("Error saving central history:", e);
    return null;
  }
};

/**
 * Gets all analysis history from the central server.
 */
export const getAnalysisHistory = async (): Promise<AnalysisResult[]> => {
  try {
    const response = await fetch('/api/history');
    if (!response.ok) throw new Error("HTTP error fetching history");
    return await response.json();
  } catch (e) {
    console.error("Error fetching central history:", e);
    return [];
  }
};

/**
 * Deletes an analysis item by ID from the central server.
 */
export const deleteAnalysisFromHistory = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/history/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error("HTTP error deleting history");
    const data = await response.json();
    return !!data.success;
  } catch (e) {
    console.error("Error deleting central history item:", e);
    return false;
  }
};