
export interface ReferenceData {
  book: string;
  technique: string;
  belt: string;
  quote: string;
}

export interface GroundingSource {
  url: string;
  title: string;
}

export interface FighterAnalysis {
  role: string; // e.g., "Luchador Superior (Gi Blanco)" or "Luchador Inferior"
  status: 'approved' | 'correction_needed';
  summary: string;
  techniques: string[];
  mistakes: string[];
  tips: string[];
  reference: ReferenceData;
  youtube_query: string;
}

export interface AnalysisResult {
  id?: string; // Local ID
  timestamp?: number; // Unix timestamp
  fighters: FighterAnalysis[]; // Array containing exactly 2 fighters
  groundingSources?: GroundingSource[];
}

export type AppView = 'home' | 'record' | 'preview' | 'uploading' | 'analyzing' | 'result' | 'history' | 'library' | 'progress';

export interface VideoState {
  blob: Blob | null;
  url: string | null;
  duration: number;
}

export interface RagSource {
  id: string;
  type: 'pdf' | 'youtube';
  name: string;
  url?: string;
  contentSummary: string;
  validated: boolean;
  timestamp: number;
  techniquesCovered: string[];
}

export interface TechniqueProgress {
  techniqueName: string;
  status: 'learning' | 'mastered';
  attemptsCount: number;
  successRate: number; // percentage (0 to 100)
  lastObservedStatus: 'approved' | 'correction_needed';
  lastAttemptTimestamp: number;
  mistakesHistory: string[];
  assignedVideoQuery: string; // adapted query
  recommendationReasoning?: string;
  adaptationVersion: number;
}

export interface LearningAdaptationLog {
  id: string;
  timestamp: number;
  techniqueName: string;
  previousQuery: string;
  newQuery: string;
  reason: string;
}