import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, StopCircle, Circle, Repeat, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { recorderService } from '../services/recorderService';

interface CameraViewProps {
    onVideoCaptured: (blob: Blob) => void;
    onOpenLibrary: () => void;
}

export function CameraView({ onVideoCaptured, onOpenLibrary }: CameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const initCamera = async () => {
            try {
                const stream = await recorderService.startCamera();
                if (mounted && videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsCameraReady(true);
                }
            } catch (err) {
                if (mounted) setError("Could not access camera. Please allow permissions.");
            }
        };

        initCamera();

        return () => {
            mounted = false;
            recorderService.stopCamera();
        };
    }, []);

    const handleToggleRecord = async () => {
        if (isRecording) {
            // Stop
            setIsRecording(false);
            try {
                const blob = await recorderService.stopRecording();
                onVideoCaptured(blob);
            } catch (err) {
                console.error("Error saving video:", err);
            }
        } else {
            // Start
            try {
                recorderService.startRecording();
                setIsRecording(true);
            } catch (err) {
                console.error("Error starting record:", err);
            }
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-black text-white p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-2">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-lg font-semibold">Camera Access Needed</h3>
                <p className="text-white/60 max-w-xs">{error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        window.location.reload(); // Simple retry
                    }}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-full font-medium transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full bg-black overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl ring-1 ring-white/10">
            {/* Viewfinder */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                    videoRef.current?.play().catch(e => console.error("Play error:", e));
                }}
                className="w-full h-full object-cover"
            />

            {/* Overlays */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={async () => {
                        setIsCameraReady(false);
                        recorderService.stopCamera();
                        const stream = await recorderService.startCamera('user'); // Toggle to user? Or just restart. 
                        // For MVP, just restart to 'environment' effectively. To strictly toggle requires state config. 
                        // I'll keep it simple: just restart.
                        if (videoRef.current) videoRef.current.srcObject = stream;
                        setIsCameraReady(true);
                    }}
                    className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white/90 active:scale-95 transition-transform"
                >
                    <Repeat size={20} />
                </button>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 w-full p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">

                {/* Library Button */}
                <button
                    onClick={onOpenLibrary}
                    className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                >
                    <ImageIcon size={24} />
                </button>

                {/* Shutter Button */}
                <button
                    onClick={handleToggleRecord}
                    disabled={!isCameraReady}
                    className="relative group disabled:opacity-50"
                >
                    {/* Outer Ring */}
                    <motion.div
                        animate={isRecording ? { scale: 1.2, borderColor: '#ef4444' } : { scale: 1, borderColor: '#ffffff' }}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-colors duration-300"
                    >
                        {/* Inner Circle / Square */}
                        <motion.div
                            initial={false}
                            animate={isRecording ? {
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                                backgroundColor: '#ef4444'
                            } : {
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: '#ffffff'
                            }}
                            className="bg-white"
                        />
                    </motion.div>
                </button>

                <div className="w-[56px]" />
            </div>

            {/* Recording Indicator */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500/80 backdrop-blur rounded-full flex items-center gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-white text-xs font-medium tracking-wide">REC</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
