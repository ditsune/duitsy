'use client';

import Icon from './Icon';
import { monthLabel } from '@/lib/types';

type TopBarProps = {
  monthDate: Date;
  onPrev: () => void;
  onNext: () => void;
};

export default function TopBar({ monthDate, onPrev, onNext }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-dashed bg-paper"
      style={{ borderColor: 'var(--line-soft)' }}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2">
        <span className="font-hand text-[26px] leading-none text-ink">Duitsy</span>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Bulan sebelumnya"
            className="tap flex items-center justify-center rounded-field text-ink-3 transition-colors duration-150 hover:bg-paper-2 hover:text-ink"
          >
            <Icon name="chevron-left" size={18} />
          </button>

          <p
            aria-live="polite"
            className="w-[8.75rem] text-center text-xs font-medium leading-none text-ink-2"
          >
            {monthLabel(monthDate)}
          </p>

          <button
            type="button"
            onClick={onNext}
            aria-label="Bulan berikutnya"
            className="tap flex items-center justify-center rounded-field text-ink-3 transition-colors duration-150 hover:bg-paper-2 hover:text-ink"
          >
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
