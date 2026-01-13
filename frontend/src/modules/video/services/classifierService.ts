
interface AnalysisResult {
    status: 'success' | 'warning' | 'error';
    prediction?: string;
    confidence?: number;
    message?: string;
    detail?: string;
}

export const classifierService = {
    /**
     * Sends a video blob (or image blob) to the Python Backend for analysis.
     * Endpoint: /api/analyze
     */
    async analyzeVideo(blob: Blob, filename: string = 'capture.webm'): Promise<AnalysisResult> {
        const formData = new FormData();
        formData.append('file', blob, filename);

        try {
            // Assume backend is running on localhost:8000
            // In a real env, this URL should be an env variable
            const response = await fetch('http://localhost:8000/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();
            return data as AnalysisResult;
        } catch (error: any) {
            console.error("Classifier Service Error:", error);
            return {
                status: 'error',
                message: 'Could not connect to analysis server.',
                detail: error.message
            };
        }
    }
};
