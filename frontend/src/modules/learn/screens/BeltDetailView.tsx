import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, PlayCircle, Book } from 'lucide-react';
import {
    WHITE_BELT_DATA,
    BLUE_BELT_DATA,
    PURPLE_BELT_DATA,
    BROWN_BELT_DATA,
    BLACK_BELT_DATA,
    BeltData
} from '../data';

const BeltDetailView: React.FC = () => {
    const { beltId } = useParams();
    const navigate = useNavigate();

    const beltDataMap: Record<string, BeltData> = {
        'white': WHITE_BELT_DATA,
        'blue': BLUE_BELT_DATA,
        'purple': PURPLE_BELT_DATA,
        'brown': BROWN_BELT_DATA,
        'black': BLACK_BELT_DATA
    };

    const data = beltId ? beltDataMap[beltId.toLowerCase()] : null;

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-500 bg-zinc-950">
                <div className="text-center">
                    <h2 className="text-xl mb-2">Contenido no encontrado</h2>
                    <button onClick={() => navigate('/learn')} className="text-blue-500 hover:underline">Volver al Dojo</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 pb-24">
            {/* Header with Back Button */}
            <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate('/learn')}
                    className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold text-white capitalize">{data.title}</h1>
            </div>

            <div className="px-4 pt-6 max-w-4xl mx-auto">
                {/* Belt Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium tracking-wider uppercase mb-3">
                        Concepto Principal: {data.concept}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        {data.title}
                    </h2>
                    <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">
                        {data.description}
                    </p>
                </motion.div>

                {/* Chapters List */}
                <div className="space-y-8">
                    {data.chapters.map((chapter, chapterIndex) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: chapterIndex * 0.1 }}
                        >
                            <h3 className="text-xl font-bold text-zinc-200 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm text-zinc-400 font-mono">
                                    {chapterIndex + 1}
                                </span>
                                {chapter.title}
                            </h3>

                            <div className="grid gap-3 md:grid-cols-2">
                                {chapter.techniques.map((technique) => (
                                    <motion.div
                                        key={technique.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate(`/learn/technique/${technique.id}`)}
                                        className="group bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                                                    {technique.title}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                                                    {technique.videoId && (
                                                        <span className="flex items-center gap-1 text-blue-400/80">
                                                            <PlayCircle size={12} /> Video
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Book size={12} /> {technique.steps.length > 0 ? `${technique.steps.length} Pasos` : 'Detalles dentro'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-700 group-hover:text-zinc-300 transition-colors">
                                                <ChevronLeft size={16} className="rotate-180" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BeltDetailView;
