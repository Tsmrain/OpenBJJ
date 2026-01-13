
export class RecorderService {
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];
    private stream: MediaStream | null = null;

    async startCamera(facingMode: 'user' | 'environment' = 'environment'): Promise<MediaStream> {
        if (this.stream) {
            this.stopCamera();
        }

        const constraints: MediaStreamConstraints = {
            video: {
                facingMode: facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 },
            },
            audio: true // Optional for classification but good for context
        };

        try {
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            return this.stream;
        } catch (error) {
            console.warn("Primary camera failed, trying fallback...", error);
            // Fallback
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            return this.stream;
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    startRecording() {
        if (!this.stream) throw new Error("No stream active");
        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm' });

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };

        this.mediaRecorder.start();
    }

    async stopRecording(): Promise<Blob> {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) return reject("Recorder not initialized");

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }

    async captureFrame(videoElement: HTMLVideoElement): Promise<Blob> {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Canvas context failed");

        ctx.drawImage(videoElement, 0, 0);
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (blob) resolve(blob);
                else reject("Frame capture failed");
            }, 'image/jpeg', 0.85);
        });
    }
}

export const recorderService = new RecorderService();
