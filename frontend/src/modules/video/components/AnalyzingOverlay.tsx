import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export const AnalyzingOverlay: React.FC = () => {
    const messages = [
        "Procesando video...",
        "Identificando posturas...",
        "Analizando transiciones...",
        "Detectando sumisiones...",
        "Generando feedback técnico..."
    ];

    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl">
            <div className="flex flex-col items-center space-y-8">
                {/* Pulsing Core */}
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.1, 0.3],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl"
                    />
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 20px rgba(34,211,238,0.2)",
                                "0 0 60px rgba(34,211,238,0.5)",
                                "0 0 20px rgba(34,211,238,0.2)"
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative w-24 h-24 bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-white/10 flex items-center justify-center z-10"
                    >
                        <Brain className="w-10 h-10 text-cyan-400" />
                    </motion.div>
                </div>

                {/* Text Animation */}
                <div className="h-8 overflow-hidden relative w-64 text-center">
                    <motion.p
                        key={messageIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-lg text-cyan-100 font-light tracking-wide absolute w-full"
                    >
                        {messages[messageIndex]}
                    </motion.p>
                </div>
            </div>
        </div>
    );
};
