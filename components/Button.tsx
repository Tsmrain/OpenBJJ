import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'glass';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 outline-none select-none";
  
  const variants = {
    primary: "bg-black text-white shadow-lg hover:bg-gray-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent",
    danger: "bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600",
    glass: "bg-white/40 backdrop-blur-md border border-white/50 text-gray-800 shadow-sm hover:bg-white/50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;