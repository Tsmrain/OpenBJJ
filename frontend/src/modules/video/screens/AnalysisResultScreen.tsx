import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, ChevronRight, Share2, Info } from 'lucide-react';

interface AnalysisEvent {
    id: string;
    timestamp: number; // in percentage 0-100 or seconds
    title: string;
    description: string;
    score?: number;
    type: 'success' | 'warning' | 'info';
}

interface AnalysisResultScreenProps {
    videoBlob: Blob | null;
    videoUrl?: string; // Fallback if blob is not provided directly
    result: any; // Ideally strictly typed, but flexible for now
    onReset: () => void;
}

export const AnalysisResultScreen: React.FC<AnalysisResultScreenProps> = ({ videoBlob, result, onReset }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<AnalysisEvent | null>(null);

    // Mocking events based on the result or standard dummy data for UI demo
    // In production, these would come from the Gemini analysis result.detail
    const events: AnalysisEvent[] = [
        { id: '1', timestamp: 15, title: 'Guardia Cerrada', description: 'Excelente control de postura. Buen agarre de solapa.', score: 9, type: 'success' },
        { id: '2', timestamp: 45, title: 'Intento de Triángulo', description: 'La cadera no subió lo suficiente. Riesgo de pase.', score: 6, type: 'warning' },
        { id: '3', timestamp: 80, title: 'Transición a Montada', description: 'Fluidez perfecta. 4 puntos IBJJF asegurados.', score: 10, type: 'success' },
    ];

    const videoSrc = videoBlob ? URL.createObjectURL(videoBlob) : '';

    return (
        <div className="h-full flex flex-col bg-black relative overflow-hidden">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={onReset} className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white">
                    <X size={24} />
                </button>
                <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-xs font-medium text-emerald-400">Análisis Completado</span>
                </div>
                <button className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative bg-zinc-900">
                <video
                    src={videoSrc}
                    className="w-full h-full object-cover"
                    controls={false} // Custom controls if desired, or standard
                    autoPlay
                    loop
                    muted
                />

                {/* Overlay Gradient at bottom for timeline visibility */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

                {/* Timeline UI */}
                <div className="absolute bottom-8 left-4 right-4 z-10">
                    <div className="relative h-2 bg-white/20 rounded-full overflow-visible">
                        {/* Progress bar (mocked at 50% for visual) */}
                        <div className="absolute top-0 left-0 h-full bg-emerald-500 w-1/2 rounded-full" />

                        {/* Event Markers */}
                        {events.map((ev) => (
                            <motion.button
                                key={ev.id}
                                whileHover={{ scale: 1.5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedEvent(ev)}
                                style={{ left: `${ev.timestamp}%` }}
                                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-black transform -translate-x-1/2 shadow-lg ${ev.type === 'success' ? 'bg-emerald-400' : 'bg-amber-400'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-mono">
                        <span>00:00</span>
                        <span>01:30</span>
                    </div>
                </div>
            </div>

            {/* Event Card Overlay (Glassmorphism) */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="absolute bottom-0 left-0 right-0 p-4 z-30"
                    >
                        <div className="bg-zinc-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none opacity-50 ${selectedEvent.type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`} />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                                        {selectedEvent.score && (
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${selectedEvent.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                                                }`}>
                                                {selectedEvent.score}/10
                                            </span>
                                        )}
                                    </div>
                                    <button onClick={() => setSelectedEvent(null)} className="text-zinc-400 hover:text-white rounded-full p-1 bg-black/20">
                                        <X size={16} />
                                    </button>
                                </div>

                                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                                    {selectedEvent.description}
                                </p>

                                <button className="w-full py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                                    Ver Detalle Técnico
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Summary (if no event selected) */}
            {!selectedEvent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-2 border border-white/5 pointer-events-none"
                >
                    <Info size={14} className="text-zinc-400" />
                    <span className="text-xs text-zinc-300">Toca los puntos en la línea de tiempo</span>
                </motion.div>
            )}
        </div>
    );
};
