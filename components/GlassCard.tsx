import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white/70 backdrop-blur-xl 
        border border-white/40 
        shadow-xl shadow-black/5 
        rounded-3xl 
        overflow-hidden
        ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;