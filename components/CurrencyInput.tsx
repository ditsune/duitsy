'use client';

import { useLayoutEffect, useRef } from 'react';

type CurrencyInputProps = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  describedBy?: string;
  invalid?: boolean;
};

/**
 * Input rupiah yang mempertahankan posisi kursor saat angka diformat ulang.
 * `id` wajib supaya selalu ada <label htmlFor> yang menunjuk ke sini.
 */
export default function CurrencyInput({
  id,
  value,
  onChange,
  placeholder = '0',
  className,
  autoFocus,
  describedBy,
  invalid = false,
}: CurrencyInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const pendingCursor = useRef<number | null>(null);

  const formatted = value ? value.toLocaleString('id-ID') : '';

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || pendingCursor.current === null) return;
    el.setSelectionRange(pendingCursor.current, pendingCursor.current);
    pendingCursor.current = null;
  }, [formatted]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const el = event.target;
    const cursorBefore = el.selectionStart ?? el.value.length;
    const digitsBeforeCursor = el.value.slice(0, cursorBefore).replace(/[^\d]/g, '').length;

    const raw = el.value.replace(/[^\d]/g, '');
    const nextValue = parseInt(raw || '0', 10);
    const nextFormatted = nextValue ? nextValue.toLocaleString('id-ID') : '';

    let digitsSeen = 0;
    let nextPosition = nextFormatted.length;
    if (digitsBeforeCursor === 0) {
      nextPosition = 0;
    } else {
      for (let i = 0; i < nextFormatted.length; i += 1) {
        if (/\d/.test(nextFormatted[i])) digitsSeen += 1;
        if (digitsSeen === digitsBeforeCursor) {
          nextPosition = i + 1;
          break;
        }
      }
    }
    pendingCursor.current = nextPosition;

    onChange(nextValue);
  }

  return (
    <input
      ref={ref}
      id={id}
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      value={formatted}
      onChange={handleChange}
      autoFocus={autoFocus}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={className}
    />
  );
}
