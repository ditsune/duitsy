/**
 * Loading state. Sengaja statis (tanpa pulse) supaya tidak menambah gerak:
 * dial MOTION 1 hanya memakai transisi hover dan fokus.
 */
export default function LoadingRows({ count = 4, label = 'Memuat data' }: { count?: number; label?: string }) {
  return (
    <div role="status" aria-live="polite" className="pt-2">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} aria-hidden="true" className="flex items-center gap-3 py-3">
          <div className="h-9 w-9 shrink-0 rounded-field bg-paper-3" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-1/2 rounded-full bg-paper-3" />
            <div className="h-2 w-1/4 rounded-full bg-paper-3" />
          </div>
          <div className="h-2.5 w-16 rounded-full bg-paper-3" />
        </div>
      ))}
    </div>
  );
}
