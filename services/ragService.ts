import { RagSource, TechniqueProgress, LearningAdaptationLog, FighterAnalysis } from "../types";

export const RagService = {
  // --- SOURCES ---
  saveRagSource: async (source: RagSource): Promise<string> => {
    try {
      const response = await fetch('/api/rag/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(source)
      });
      if (!response.ok) throw new Error("Failed to save RAG source");
      const data = await response.json();
      return data.id || '';
    } catch (e) {
      console.error("Error saving RAG source:", e);
      return '';
    }
  },

  getRagSources: async (): Promise<RagSource[]> => {
    try {
      const response = await fetch('/api/rag/sources');
      if (!response.ok) throw new Error("Failed to fetch RAG sources");
      const all = await response.json();
      return all;
    } catch (e) {
      console.error("Error getting RAG sources:", e);
      return [];
    }
  },

  getValidatedRagSources: async (): Promise<RagSource[]> => {
    try {
      const sources = await RagService.getRagSources();
      return sources.filter(s => s.validated);
    } catch (e) {
      console.error("Error getting validated RAG sources:", e);
      return [];
    }
  },

  deleteRagSource: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/rag/sources/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Failed to delete RAG source");
      const data = await response.json();
      return !!data.success;
    } catch (e) {
      console.error("Error deleting RAG source:", e);
      return false;
    }
  },

  // --- PROGRESS ---
  getTechniqueProgressList: async (): Promise<TechniqueProgress[]> => {
    try {
      const response = await fetch('/api/rag/progress');
      if (!response.ok) throw new Error("Failed to fetch technique progress");
      return await response.json();
    } catch (e) {
      console.error("Error getting technique progress list:", e);
      return [];
    }
  },

  getTechniqueProgress: async (techniqueName: string): Promise<TechniqueProgress | undefined> => {
    try {
      const list = await RagService.getTechniqueProgressList();
      return list.find(p => p.techniqueName === techniqueName);
    } catch (e) {
      console.error("Error getting technique progress:", e);
      return undefined;
    }
  },

  saveTechniqueProgress: async (progress: TechniqueProgress): Promise<void> => {
    // Handled backend-side, keep as mock for compilation compatibility
  },

  // --- LOGS ---
  getAdaptationLogs: async (): Promise<LearningAdaptationLog[]> => {
    try {
      const response = await fetch('/api/rag/logs');
      if (!response.ok) throw new Error("Failed to fetch adaptation logs");
      const all = await response.json();
      return all;
    } catch (e) {
      console.error("Error getting adaptation logs:", e);
      return [];
    }
  },

  addAdaptationLog: async (log: Omit<LearningAdaptationLog, 'id' | 'timestamp'>): Promise<string> => {
    // Handled backend-side
    return '';
  },

  compileRagContext: async (): Promise<string> => {
    // Handled backend-side during audit, return empty mock
    return "";
  },

  // --- TRACKING AND ADAPTATION ---
  trackSparringAudit: async (
    fighters: FighterAnalysis[],
    adaptCallback: (techniqueName: string, currentQuery: string, mistakes: string[]) => Promise<{ newQuery: string; reasoning: string }>
  ): Promise<{ adaptedCount: number }> => {
    // Tracking is now run automatically backend-side when calling POST /api/audit.
    // Return 0 as mock
    return { adaptedCount: 0 };
  },

  // --- RESET ALL DATA ---
  clearAllRagData: async (): Promise<void> => {
    try {
      const response = await fetch('/api/reset', { method: 'POST' });
      if (!response.ok) throw new Error("Failed to reset system databases");
    } catch (e) {
      console.error("Error resetting all RAG data:", e);
    }
  }
};
