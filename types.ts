
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

export type AppView = 'home' | 'record' | 'preview' | 'uploading' | 'analyzing' | 'result' | 'history';

export interface VideoState {
  blob: Blob | null;
  url: string | null;
  duration: number;
}