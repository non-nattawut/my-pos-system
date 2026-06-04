import React, { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  containerClassName?: string;
}

export function Select({ label, containerClassName = '', className = '', children, ...props }: SelectProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider pl-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <select
          className={`w-full py-2 px-3.5 pr-10 rounded-2xl bg-zinc-950/60 border border-zinc-800 focus:border-theme-accent text-xs font-bold text-zinc-300 outline-none transition-all cursor-pointer appearance-none ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown 
          size={14} 
          className="absolute right-3.5 text-zinc-500 pointer-events-none transition-transform duration-200" 
        />
      </div>
    </div>
  );
}
