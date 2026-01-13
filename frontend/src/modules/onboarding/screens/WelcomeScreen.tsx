import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';
import { db } from '../../shared/db/db';
import { Button } from '../../core/components/Button';
import { Input } from '../../core/components/Input';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  // Check if user already exists
  useEffect(() => {
    const checkProfile = async () => {
      const profile = await db.profile.toCollection().first();
      if (profile) {
        navigate('/learn', { replace: true });
      } else {
        setLoading(false);
      }
    };
    checkProfile();
  }, [navigate]);

  const handleStart = async () => {
    if (!name.trim()) return;
    
    await db.profile.add({
      warriorName: name.trim(),
      createdAt: new Date(),
    });

    navigate('/learn');
  };

  if (loading) return null; // Or a subtle spinner

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-zinc-800 rounded-full blur-[100px] opacity-20" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-zinc-700 rounded-full blur-[100px] opacity-10" />

      <div className="w-full max-w-sm flex flex-col items-center space-y-12 z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center shadow-2xl border border-zinc-800">
            <Sword className="text-zinc-100 w-10 h-10" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Digital Dojo</h1>
            <p className="text-zinc-400 mt-2 text-sm">Jiu-Jitsu University</p>
          </div>
        </motion.div>

        <div className="w-full space-y-6">
          <Input 
            placeholder="Enter your Warrior Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Button 
            fullWidth 
            onClick={handleStart}
            disabled={!name.trim()}
          >
            Begin Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;