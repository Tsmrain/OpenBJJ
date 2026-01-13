import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-zinc-400 text-sm ml-1 font-medium">{label}</label>}
      <input
        className={`
          w-full bg-zinc-900/50 border border-zinc-800 
          text-zinc-100 placeholder-zinc-600 rounded-2xl px-5 py-4 
          focus:outline-none focus:border-zinc-600 focus:bg-zinc-900
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
};