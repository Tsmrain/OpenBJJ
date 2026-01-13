import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    WHITE_BELT_DATA,
    BLUE_BELT_DATA,
    PURPLE_BELT_DATA,
    BROWN_BELT_DATA,
    BLACK_BELT_DATA
} from '../data';

const TechniquePlayerView: React.FC = () => {
    const { techniqueId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'steps' | 'mistakes'>('steps');

    const allBelts = [WHITE_BELT_DATA, BLUE_BELT_DATA, PURPLE_BELT_DATA, BROWN_BELT_DATA, BLACK_BELT_DATA];

    let technique = null;

    for (const belt of allBelts) {
        for (const chapter of belt.chapters) {
            const found = chapter.techniques.find(t => t.id === techniqueId);
            if (found) {
                technique = found;
                break;
            }
        }
        if (technique) break;
    }

    if (!technique) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-500 bg-zinc-950">
                <div className="text-center">
                    <h2 className="text-xl mb-2">Técnica no encontrada</h2>
                    <button onClick={() => navigate('/learn')} className="text-blue-500 hover:underline">Volver al Dojo</button>
                </div>
            </div>
        );
    }

    const isLocalVideo = technique.videoId && /\.(mp4|webm|mov)$/i.test(technique.videoId);
    const videoSrc = isLocalVideo && !technique.videoId?.startsWith('http') && !technique.videoId?.startsWith('/')
        ? `/videos/${technique.videoId}`
        : technique.videoId;

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-white truncate">{technique.title}</h1>
                </div>
            </div>

            <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:flex lg:gap-8 items-start">

                {/* Video Section */}
                <div className="w-full lg:flex-[1.5] flex-shrink-0 mb-6 lg:mb-0">
                    <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
                        {technique.videoId ? (
                            isLocalVideo ? (
                                <video
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                    src={videoSrc}
                                    controls
                                    playsInline
                                    controlsList="nodownload"
                                />
                            ) : (
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${technique.videoId}${technique.videoId.includes('?') ? '&' : '?'}rel=0&modestbranding=1`}
                                    title={technique.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )
                        ) : technique.imagePlaceholder ? (
                            <img
                                src={technique.imagePlaceholder}
                                alt={technique.title}
                                className="absolute top-0 left-0 w-full h-full object-contain opacity-90"
                            />
                        ) : (
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-900">
                                <span className="mb-2 text-4xl">🥋</span>
                                <p>Video próximamente</p>
                                <p className="text-xs mt-2 opacity-50">Practica los pasos abajo</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section (Tabs) */}
                <div className="w-full lg:flex-1">
                    <div className="flex border-b border-zinc-800 mb-6">
                        <TabButton
                            active={activeTab === 'steps'}
                            onClick={() => setActiveTab('steps')}
                            label="Pasos"
                            icon={<List size={18} />}
                        />
                        <TabButton
                            active={activeTab === 'mistakes'}
                            onClick={() => setActiveTab('mistakes')}
                            label="Errores Comunes"
                            icon={<AlertCircle size={18} />}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'steps' ? (
                                <div className="space-y-4">
                                    {technique.steps.length > 0 ? (
                                        technique.steps.map((step, idx) => (
                                            <div key={step.id} className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                                                <div className="flex gap-4">
                                                    <span className="font-mono text-zinc-500 font-bold mt-0.5">{idx + 1}.</span>
                                                    <p className="text-zinc-300 leading-relaxed">{step.text}</p>
                                                </div>
                                                {step.imagePlaceholder && (
                                                    <div className="mt-3 rounded-lg overflow-hidden border border-zinc-800">
                                                        <img
                                                            src={step.imagePlaceholder}
                                                            alt={`Imagen para paso ${idx + 1}`}
                                                            className="w-full h-auto object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-800/50 text-center">
                                            <p className="text-zinc-500 italic">Los pasos detallados se están transcribiendo de los pergaminos.</p>
                                            <p className="text-xs text-zinc-600 mt-2">vuelve pronto.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {technique.misconceptions.length > 0 ? (
                                        technique.misconceptions.map((mistake, idx) => (
                                            <div key={idx} className="flex gap-3 p-4 rounded-xl bg-red-950/10 border border-red-900/20">
                                                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                                                <p className="text-red-200/80 leading-relaxed">{mistake}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-800/50 text-center">
                                            <p className="text-zinc-500 italic">No hay errores comunes listados.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div >
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium border-b-2 transition-colors ${active
            ? 'border-blue-500 text-blue-400'
            : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
    >
        {icon}
        {label}
    </button>
)

export default TechniquePlayerView;
