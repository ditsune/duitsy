'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import Icon from './Icon';

type SheetProps = {
  title: string;
  onClose: () => void;
  /** Draft sudah berubah? Kalau ya, menutup minta konfirmasi dulu. */
  dirty?: boolean;
  /** Tombol di kanan judul, misal "Simpan". */
  action?: ReactNode;
  children: ReactNode;
  describedBy?: string;
};

/**
 * Sheet berbasis <dialog> native, jadi Escape, focus trap, dan pengembalian
 * fokus ditangani browser. Backdrop tidak langsung membuang draft: kalau
 * `dirty`, muncul konfirmasi kecil di bawah.
 */
export default function Sheet({ title, onClose, dirty = false, action, children, describedBy }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!el.open) el.showModal();

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  function requestClose() {
    if (dirty && !asking) {
      setAsking(true);
      return;
    }
    onClose();
  }

  function handleCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      onCancel={handleCancel}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-ink"
    >
      <div
        className="flex h-full flex-col justify-end"
        onClick={(event) => {
          if (event.target === event.currentTarget) requestClose();
        }}
      >
        <div className="mx-auto flex max-h-[88vh] w-full max-w-app flex-col rounded-t-sheet bg-paper shadow-2xl">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line px-2 py-1.5">
            <button
              type="button"
              onClick={requestClose}
              aria-label="Tutup"
              className="tap flex items-center justify-center rounded-field text-ink-3 transition-colors duration-150 hover:bg-paper-3 hover:text-ink"
            >
              <Icon name="x" size={20} />
            </button>

            <h2 id={titleId} className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-ink">
              {title}
            </h2>

            <div className="flex min-w-11 items-center justify-end">{action}</div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-4">{children}</div>

          {asking && (
            <div role="alert" className="shrink-0 border-t border-line bg-paper-2 px-4 py-3">
              <p className="text-sm text-ink">Buang perubahan yang belum disimpan?</p>
              <div className="mt-2 flex gap-2">
                <button type="button" autoFocus onClick={() => setAsking(false)} className="btn-quiet flex-1">
                  Lanjut isi
                </button>
                <button type="button" onClick={onClose} className="btn-danger flex-1">
                  Buang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
