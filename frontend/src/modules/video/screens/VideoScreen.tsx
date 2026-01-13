import React, { useState, useRef } from 'react';
import { CameraView } from '../components/CameraView';
import { classifierService } from '../services/classifierService';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function VideoScreen() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAnalysis = async (blob: Blob) => {
        setIsAnalyzing(true);
        setResult(null);
        try {
            const data = await classifierService.analyzeVideo(blob);
            setResult(data);
        } catch (error) {
            setResult({ status: 'error', message: 'Analysis failed' });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black relative">
            {/* Hidden Input */}
            <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                    if (e.target.files?.[0]) handleAnalysis(e.target.files[0]);
                }}
            />

            {/* Camera Area */}
            <div className="h-[60%] w-full p-4">
                <CameraView
                    onVideoCaptured={handleAnalysis}
                    onOpenLibrary={() => fileInputRef.current?.click()}
                />
            </div>

            {/* Results Area */}
            <div className="flex-1 bg-zinc-900/50 backdrop-blur-md rounded-t-3xl p-6 border-t border-white/5 overflow-y-auto">
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

                <h2 className="text-xl font-bold text-amber-500 mb-4">Live BJJ Classification</h2>

                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                        <p className="text-zinc-400">Analyzing movement patterns...</p>
                    </div>
                ) : result ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-2xl border ${result.status === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-red-500/10 border-red-500/30'
                            }`}
                    >
                        {result.status === 'success' ? (
                            <div className="text-center space-y-2">
                                <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">{result.prediction}</h3>
                                <div className="text-4xl font-black text-emerald-400">
                                    {(result.confidence * 100).toFixed(1)}%
                                </div>
                                <p className="text-zinc-500 text-sm">Confidence Score</p>
                            </div>
                        ) : (
                            <div className="flex items-start gap-4 text-red-400">
                                <AlertCircle className="shrink-0" />
                                <div>
                                    <h3 className="font-bold">Error</h3>
                                    <p className="text-sm opacity-80">{result.message || 'Unknown error'}</p>
                                    {result.detail && <pre className="mt-2 text-xs bg-black/30 p-2 rounded overflow-x-auto">{result.detail}</pre>}
                                    {result.detail && result.detail.includes("Model not found") && (
                                        <div className="mt-3 p-2 bg-amber-500/20 text-amber-200 text-xs rounded">
                                            <strong>Action Required:</strong> Please place <code>bjj_position_model.h5</code> in backend/ml/models.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <p className="text-zinc-500 text-center py-10">
                        Record a video or upload a clip to identify the BJJ position.
                    </p>
                )}
            </div>
        </div>
    );
}
