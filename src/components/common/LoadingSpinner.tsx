import React from 'react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Processing...', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base',
  };

  return (
    <div className="flex items-center justify-center gap-3 p-4 text-on-surface-variant font-display">
      <div
        className={`${sizeMap[size].split(' ')[0]} ${sizeMap[size].split(' ')[1]} border-2 border-muted-gold border-t-transparent rounded-full animate-spin`}
      />
      {label && <span className="text-xs font-semibold text-on-surface">{label}</span>}
    </div>
  );
};
