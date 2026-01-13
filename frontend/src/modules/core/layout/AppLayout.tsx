import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BookOpen, PlayCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-24">
      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto min-h-screen relative px-4 md:px-8">
        <Outlet />
      </main>

      {/* Floating Bottom Tab Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 shadow-2xl pointer-events-auto flex items-center gap-10"
        >
          <NavItem to="/learn" icon={<BookOpen size={24} />} label="Aprender" />
          <NavItem to="/video" icon={<PlayCircle size={24} />} label="Video" />
          <NavItem to="/progress" icon={<TrendingUp size={24} />} label="Progreso" />
        </motion.nav>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex flex-col items-center gap-1.5 transition-all duration-300
      ${isActive ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-zinc-500 hover:text-zinc-300'}
    `}
  >
    {icon}
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </NavLink>
);

export default AppLayout;