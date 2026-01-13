import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-4 rounded-2xl font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950";
  
  const variants = {
    primary: "bg-zinc-100 text-zinc-950 hover:bg-white focus:ring-zinc-100",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus:ring-zinc-700",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};