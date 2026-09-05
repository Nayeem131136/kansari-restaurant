import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'terracotta-outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  id?: string;
  disabled?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className, 
  id,
  ...props 
}: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center whitespace-nowrap font-sans tracking-[0.2em] uppercase transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta active:scale-[0.98] select-none group cursor-pointer disabled:opacity-50 disabled:pointer-events-none";
  
  const sizeStyles = {
    sm: "text-[11px] px-5 py-2.5",
    md: "text-xs px-8 py-4",
    lg: "text-sm px-10 py-5"
  };

  const variants = {
    primary: "bg-terracotta text-ivory hover:bg-charcoal shadow-sm hover:shadow-md",
    secondary: "bg-charcoal text-ivory hover:bg-terracotta shadow-sm hover:shadow-md",
    outline: "border border-charcoal/25 text-charcoal hover:border-charcoal hover:bg-charcoal/5",
    'terracotta-outline': "border border-terracotta/40 text-terracotta hover:border-terracotta hover:bg-terracotta/5",
    text: "text-charcoal hover:text-terracotta p-2 hover:translate-x-1"
  };

  return (
    <button 
      id={id}
      className={cn(baseStyles, sizeStyles[size], variants[variant], className)} 
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2.5 font-medium">
        {children}
      </span>
    </button>
  );
}

