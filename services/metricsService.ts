import { AnalysisResult } from "../types";

export interface MetricEvent {
    id: string;
    timestamp: number;
    type: 'analysis' | 'error' | 'system';
    durationMs?: number;
    tokensInput?: number;
    tokensOutput?: number;
    model?: string;
    success: boolean;
    errorType?: string;
    details?: string;
}

const STORAGE_KEY = 'openbjj_metrics';

export const MetricsService = {
    logAnalysis: (
        durationMs: number,
        tokensInput: number,
        tokensOutput: number,
        model: string
    ) => {
        const event: MetricEvent = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'analysis',
            success: true,
            durationMs,
            tokensInput,
            tokensOutput,
            model
        };
        saveEvent(event);
    },

    logError: (source: string, error: any) => {
        const event: MetricEvent = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'error',
            success: false,
            errorType: source,
            details: error.message || String(error)
        };
        saveEvent(event);
    },

    getMetrics: (): MetricEvent[] => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    },

    getSummary: () => {
        const events = MetricsService.getMetrics();
        const analyses = events.filter(e => e.type === 'analysis');
        const errors = events.filter(e => e.type === 'error');

        if (analyses.length === 0) return null;

        const totalLatency = analyses.reduce((acc, curr) => acc + (curr.durationMs || 0), 0);
        const avgLatency = totalLatency / analyses.length;

        // Cost estimation for Gemini 2.0 Flash (Approx $0.10/1M input, $0.40/1M output)
        const totalInput = analyses.reduce((acc, curr) => acc + (curr.tokensInput || 0), 0);
        const totalOutput = analyses.reduce((acc, curr) => acc + (curr.tokensOutput || 0), 0);
        const estimatedCost = ((totalInput / 1_000_000) * 0.10) + ((totalOutput / 1_000_000) * 0.40);

        return {
            totalRuns: analyses.length,
            successRate: ((analyses.length / (analyses.length + errors.length)) * 100).toFixed(1) + '%',
            avgLatency: (avgLatency / 1000).toFixed(2) + 's',
            totalTokens: totalInput + totalOutput,
            estimatedCost: `$${estimatedCost.toFixed(6)}`,
            lastError: errors.length > 0 ? errors[errors.length - 1].details : 'None'
        };
    },

    clearMetrics: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};

function saveEvent(event: MetricEvent) {
    try {
        const current = MetricsService.getMetrics();
        // Keep last 50 events to avoid storage issues
        const updated = [...current, event].slice(-50);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to save metric", e);
    }
}
