export function Legend() {
  return (
    <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded border bg-card" /> Belum dijawab
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded bg-success" /> Sudah dijawab
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded ring-2 ring-brand" /> Soal aktif
      </div>
    </div>
  );
}
