import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '../../core/components/Button';

interface VideoInputScreenProps {
    onRecord: () => void;
    onUpload: () => void;
}

export const VideoInputScreen: React.FC<VideoInputScreenProps> = ({ onRecord, onUpload }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements for depth */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md space-y-12 z-10"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-20 h-20 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-500/10"
                    >
                        <Sparkles className="w-10 h-10 text-cyan-300" />
                    </motion.div>
                    <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        VideoAI
                    </h1>
                    <p className="text-lg text-zinc-400 font-light leading-relaxed">
                        ¿Qué analizaremos hoy?
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={onRecord}
                        className="h-20 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-none shadow-lg shadow-cyan-900/20"
                    >
                        <Camera className="mr-3 w-6 h-6" />
                        Grabar Combate
                    </Button>

                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={onUpload}
                        className="h-20 text-lg bg-zinc-900/50 hover:bg-zinc-800/50 backdrop-blur-md border border-white/5"
                    >
                        <ImageIcon className="mr-3 w-6 h-6" />
                        Analizar Biblioteca
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
