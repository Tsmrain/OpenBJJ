import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VideoInputScreen } from './VideoInputScreen';
import { CameraView } from '../components/CameraView';
import { AnalyzingOverlay } from '../components/AnalyzingOverlay';
import { AnalysisResultScreen } from './AnalysisResultScreen';
import { classifierService } from '../services/classifierService';

type ViewState = 'input' | 'camera' | 'analyzing' | 'result';

export default function VideoScreen() {
    const [view, setView] = useState<ViewState>('input');
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Handlers ---

    const handleStartRecording = () => {
        setView('camera');
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            processVideo(e.target.files[0]);
        }
    };

    const handleVideoCaptured = (blob: Blob) => {
        processVideo(blob);
    };

    const processVideo = async (blob: Blob) => {
        setCapturedBlob(blob);
        setView('analyzing');

        try {
            // Simulate minimum loading time for the "experience" (animations)
            // even if the API is fast or fails immediately.
            const minTimePromise = new Promise(resolve => setTimeout(resolve, 3000));
            const analysisPromise = classifierService.analyzeVideo(blob);

            const [_, result] = await Promise.all([minTimePromise, analysisPromise]);

            setAnalysisResult(result);
            setView('result');
        } catch (error) {
            console.error("Analysis failed", error);
            // In a real app, go to an Error screen. For now, show result with error state.
            setAnalysisResult({ status: 'error', message: "No pudimos analizar el video." });
            setView('result');
        }
    };

    const handleReset = () => {
        setCapturedBlob(null);
        setAnalysisResult(null);
        setView('input');
    };

    // --- Helper for layout fix ---
    // The main layout has padding. We want full bleed for this immersive experience.
    const fullBleedClass = "mx-[-1rem] md:mx-[-2rem] h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] overflow-hidden rounded-none md:rounded-3xl relative";

    return (
        <div className={fullBleedClass}>
            {/* Hidden File Input */}
            <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <AnimatePresence mode="wait">
                {view === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-black/50"
                    >
                        <VideoInputScreen
                            onRecord={handleStartRecording}
                            onUpload={handleUploadClick}
                        />
                    </motion.div>
                )}

                {view === 'camera' && (
                    <motion.div
                        key="camera"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full"
                    >
                        <CameraView
                            onVideoCaptured={handleVideoCaptured}
                            onOpenLibrary={handleUploadClick}
                        />
                        {/* Back button for camera */}
                        <button
                            onClick={() => setView('input')}
                            className="absolute top-6 left-4 z-20 text-white/50 hover:text-white font-medium text-sm backdrop-blur-md px-3 py-1 rounded-full bg-black/20"
                        >
                            Cancelar
                        </button>
                    </motion.div>
                )}

                {view === 'analyzing' && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full relative"
                    >
                        {/* Show a blurred frame or static background behind the overlay */}
                        <div className="absolute inset-0 bg-zinc-900" />
                        <AnalyzingOverlay />
                    </motion.div>
                )}

                {view === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full"
                    >
                        <AnalysisResultScreen
                            videoBlob={capturedBlob}
                            result={analysisResult}
                            onReset={handleReset}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
