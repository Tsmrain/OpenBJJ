import { openDB, DBSchema } from 'idb';
import { RagSource, TechniqueProgress, LearningAdaptationLog, FighterAnalysis } from "../types";

const DB_NAME = 'openbjj-rag-db';
const SOURCES_STORE = 'rag-sources';
const PROGRESS_STORE = 'learning-progress';
const LOGS_STORE = 'adaptation-logs';

interface OpenBJJRAGDB extends DBSchema {
  [SOURCES_STORE]: {
    key: string;
    value: RagSource;
    indexes: { 'by-date': number };
  };
  [PROGRESS_STORE]: {
    key: string; // techniqueName
    value: TechniqueProgress;
  };
  [LOGS_STORE]: {
    key: string;
    value: LearningAdaptationLog;
    indexes: { 'by-date': number };
  };
}

const dbPromise = openDB<OpenBJJRAGDB>(DB_NAME, 1, {
  upgrade(db) {
    const sourcesStore = db.createObjectStore(SOURCES_STORE, { keyPath: 'id' });
    sourcesStore.createIndex('by-date', 'timestamp');

    db.createObjectStore(PROGRESS_STORE, { keyPath: 'techniqueName' });

    const logsStore = db.createObjectStore(LOGS_STORE, { keyPath: 'id' });
    logsStore.createIndex('by-date', 'timestamp');
  },
});

export const RagService = {
  // --- SOURCES Store ---
  
  saveRagSource: async (source: RagSource): Promise<string> => {
    try {
      const db = await dbPromise;
      await db.put(SOURCES_STORE, source);
      return source.id;
    } catch (e) {
      console.error("Error saving RAG source to DB", e);
      return '';
    }
  },

  getRagSources: async (): Promise<RagSource[]> => {
    try {
      const db = await dbPromise;
      const all = await db.getAllFromIndex(SOURCES_STORE, 'by-date');
      return all.reverse(); // Newest first
    } catch (e) {
      console.error("Error getting RAG sources", e);
      return [];
    }
  },

  getValidatedRagSources: async (): Promise<RagSource[]> => {
    try {
      const sources = await RagService.getRagSources();
      return sources.filter(s => s.validated);
    } catch (e) {
      console.error("Error getting validated RAG sources", e);
      return [];
    }
  },

  deleteRagSource: async (id: string): Promise<boolean> => {
    try {
      const db = await dbPromise;
      await db.delete(SOURCES_STORE, id);
      return true;
    } catch (e) {
      console.error("Error deleting RAG source", e);
      return false;
    }
  },

  // --- PROGRESS Store ---

  getTechniqueProgressList: async (): Promise<TechniqueProgress[]> => {
    try {
      const db = await dbPromise;
      return await db.getAll(PROGRESS_STORE);
    } catch (e) {
      console.error("Error getting technique progress list", e);
      return [];
    }
  },

  getTechniqueProgress: async (techniqueName: string): Promise<TechniqueProgress | undefined> => {
    try {
      const db = await dbPromise;
      return await db.get(PROGRESS_STORE, techniqueName);
    } catch (e) {
      console.error("Error getting technique progress", e);
      return undefined;
    }
  },

  saveTechniqueProgress: async (progress: TechniqueProgress): Promise<void> => {
    try {
      const db = await dbPromise;
      await db.put(PROGRESS_STORE, progress);
    } catch (e) {
      console.error("Error saving technique progress", e);
    }
  },

  // --- LOGS Store ---

  getAdaptationLogs: async (): Promise<LearningAdaptationLog[]> => {
    try {
      const db = await dbPromise;
      const all = await db.getAllFromIndex(LOGS_STORE, 'by-date');
      return all.reverse(); // Newest first
    } catch (e) {
      console.error("Error getting adaptation logs", e);
      return [];
    }
  },

  addAdaptationLog: async (log: Omit<LearningAdaptationLog, 'id' | 'timestamp'>): Promise<string> => {
    try {
      const db = await dbPromise;
      const id = `log-${Date.now()}`;
      const fullLog: LearningAdaptationLog = {
        ...log,
        id,
        timestamp: Date.now()
      };
      await db.put(LOGS_STORE, fullLog);
      return id;
    } catch (e) {
      console.error("Error saving adaptation log", e);
      return '';
    }
  },

  // --- DYNAMIC CONTEXT ---

  compileRagContext: async (): Promise<string> => {
    try {
      const validated = await RagService.getValidatedRagSources();
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
      console.error("Error compiling RAG context", e);
      return "";
    }
  },

  // --- TRACKING AND ADAPTATION LOGIC ---

  /**
   * Tracks techniques observed in a sparring audit and updates the learning state.
   * If a technique has consecutive errors, triggers adaptation callbacks.
   * 
   * @param fighters The fighters' technical analysis from the audit.
   * @param adaptCallback Function that calls Gemini to adapt recommendation queries/info.
   */
  trackSparringAudit: async (
    fighters: FighterAnalysis[],
    adaptCallback: (techniqueName: string, currentQuery: string, mistakes: string[]) => Promise<{ newQuery: string; reasoning: string }>
  ): Promise<{ adaptedCount: number }> => {
    let adaptedCount = 0;
    
    // We collect all techniques and status from the fighters
    for (const fighter of fighters) {
      const status = fighter.status; // 'approved' or 'correction_needed'
      const mistakes = fighter.mistakes;

      for (const techName of fighter.techniques) {
        const normalizedName = techName.trim();
        if (!normalizedName) continue;

        let progress = await RagService.getTechniqueProgress(normalizedName);

        if (!progress) {
          // Initialize progress for this technique
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
          await RagService.saveTechniqueProgress(progress);
        } else {
          // Update progress
          const prevAttempts = progress.attemptsCount;
          const newAttempts = prevAttempts + 1;
          const isApproved = status === 'approved';
          
          // Success rate as running average
          const currentSuccess = isApproved ? 100 : 0;
          const newSuccessRate = Math.round(((progress.successRate * prevAttempts) + currentSuccess) / newAttempts);

          // Build unique mistakes history
          const updatedMistakes = Array.from(new Set([...progress.mistakesHistory, ...mistakes]));

          // Check if adaptation is needed (e.g. they failed again)
          let shouldAdapt = false;
          let newQuery = progress.assignedVideoQuery;
          let reasoning = progress.recommendationReasoning || '';
          
          // Adaptation rule: consecutive correction needed (2 or more times failing in a row)
          if (progress.lastObservedStatus === 'correction_needed' && status === 'correction_needed') {
            shouldAdapt = true;
          }

          if (shouldAdapt) {
            try {
              console.log(`Adapting learning resource for: ${normalizedName}`);
              const result = await adaptCallback(normalizedName, progress.assignedVideoQuery, mistakes);
              
              // Log adaptation
              await RagService.addAdaptationLog({
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

          // Determine overall status based on success rate and last status
          let newStatus: 'learning' | 'mastered' = 'learning';
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

          await RagService.saveTechniqueProgress(progress);
        }
      }
    }

    return { adaptedCount };
  },

  // --- RESET ALL DATA ---
  
  clearAllRagData: async (): Promise<void> => {
    try {
      const db = await dbPromise;
      await db.clear(SOURCES_STORE);
      await db.clear(PROGRESS_STORE);
      await db.clear(LOGS_STORE);
    } catch (e) {
      console.error("Error clearing RAG DB stores", e);
    }
  }
};
