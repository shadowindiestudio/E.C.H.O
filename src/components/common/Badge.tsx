import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'slate' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gold', className = '' }) => {
  const styles = {
    gold: 'bg-muted-gold/10 text-muted-gold border-muted-gold/30',
    slate: 'bg-surface-container-high text-on-surface-variant border-border-slate',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-800/40',
  };

  return (
    <span
      className={`text-[10px] font-display uppercase tracking-wider px-2 py-0.5 rounded border font-semibold inline-flex items-center gap-1 ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
