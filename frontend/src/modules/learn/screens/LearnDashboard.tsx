import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../shared/db/db';
import { CURRICULUM, BeltLevel } from '../data/curriculum';

const LearnDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Guerrero');

  useEffect(() => {
    db.profile.toCollection().first().then((profile) => {
      if (profile) setName(profile.warriorName);
    });
  }, []);

  const visibleBelts = CURRICULUM.filter(belt => belt.id !== 'takedowns');

  return (
    <div className="pt-12 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Dojo</h2>
        <h1 className="text-3xl font-bold mt-1 text-zinc-100">Oss, {name}</h1>
      </motion.div>

      {/* Belt List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleBelts.map((belt, index) => (
          <BeltCard
            key={belt.id}
            belt={belt}
            index={index}
            onPress={() => !belt.isLocked && navigate(`/learn/${belt.id}`)}
          />
        ))}
      </div>

      <div className="h-10" />
    </div>
  );
};

interface BeltCardProps {
  belt: BeltLevel;
  index: number;
  onPress: () => void;
}

const BeltCard: React.FC<BeltCardProps> = ({ belt, index, onPress }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileTap={!belt.isLocked ? { scale: 0.98 } : {}}
      onClick={onPress}
      className={`
        cursor-pointer
        relative p-6 rounded-3xl overflow-hidden min-h-[140px] flex flex-col justify-between
        border border-zinc-800/50 shadow-lg
        ${belt.isLocked ? 'bg-zinc-900/40 opacity-70 cursor-not-allowed' : 'bg-zinc-900'}
      `}
    >
      {/* Background Glow Effect for active items */}
      {!belt.isLocked && (
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 rounded-full pointer-events-none ${belt.color}`} />
      )}

      <div className="flex justify-between items-start z-10">
        <div>
          <span className={`inline-block w-8 h-1 rounded-full mb-3 ${belt.color === 'bg-zinc-100' ? 'bg-zinc-100' : belt.color}`}></span>
          <h3 className="text-xl font-bold text-zinc-50">{belt.name}</h3>
          <p className="text-zinc-400 text-sm mt-1">{belt.focus}</p>
        </div>

        {belt.isLocked && (
          <Lock className="text-zinc-600 w-5 h-5" />
        )}
      </div>

      {!belt.isLocked && (
        <div className="z-10 mt-4">
          <span className="text-xs font-semibold bg-zinc-800 px-3 py-1.5 rounded-full text-zinc-300">
            0% Completado
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default LearnDashboard;