import type { ReactNode } from 'react';
import Icon from './Icon';

type EmptyStateProps = {
  icon: string;
  title: string;
  hint?: string;
  action?: ReactNode;
};

export default function EmptyState({ icon, title, hint, action }: EmptyStateProps) {
  return (
    <div className="rounded-card border border-dashed border-line px-5 py-8 text-center">
      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-field bg-paper-2 text-ink-3">
        <Icon name={icon} size={22} />
      </span>
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-[28ch] text-xs leading-relaxed text-ink-3">{hint}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
