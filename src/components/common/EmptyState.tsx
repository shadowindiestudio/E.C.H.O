import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-slate/80 rounded-xl bg-matte-black/40 my-4">
      <div className="w-12 h-12 rounded-full bg-surface-container-high border border-border-slate flex items-center justify-center text-on-surface-variant mb-3">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <h4 className="font-display font-semibold text-sm text-on-surface">{title}</h4>
      <p className="text-xs text-on-surface-variant max-w-sm mt-1 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 bg-muted-gold text-matte-black px-4 py-1.5 rounded font-display text-xs font-bold hover:bg-primary-fixed transition-colors shadow"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
