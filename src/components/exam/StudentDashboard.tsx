import { useState } from "react";
import {
  Clock,
  FileText,
  Play,
  ClipboardList,
  LogOut,
  GraduationCap,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type HistoryItem = {
  id: string;
  title: string;
  date: string;
  released: boolean;
  score: number | null;
};

const HISTORY: HistoryItem[] = [
  {
    id: "h1",
    title: "UTS - Algoritma",
    date: "12 Okt 2025",
    released: true,
    score: 84,
  },
  {
    id: "h2",
    title: "Kuis 3 - Struktur Data",
    date: "5 Nov 2025",
    released: true,
    score: 90,
  },
  {
    id: "h3",
    title: "Kuis 4 - Greedy & DP",
    date: "20 Nov 2025",
    released: false,
    score: null,
  },
];

interface StudentDashboardProps {
  onStart: () => void;
  onLogout: () => void;
}

export function StudentDashboard({ onStart, onLogout }: StudentDashboardProps) {
  const [resultOpen, setResultOpen] = useState<HistoryItem | null>(null);

  return (
    <>
      <TopBar onLogout={onLogout} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Halo, Andi</h1>
          <p className="text-sm text-muted-foreground">
            Berikut daftar ujian aktif untuk Anda.
          </p>
        </div>

        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Daftar Ujian
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">
                  Ujian Akhir Semester - Algoritma
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Prodi Teknik Informatika - Semester Ganjil 2025
                </p>
              </div>
              <Badge className="bg-brand-soft text-brand hover:bg-brand-soft">
                Tersedia
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InfoTile icon={<Clock className="h-4 w-4" />} label="Durasi" value="100 Menit" />
              <InfoTile
                icon={<FileText className="h-4 w-4" />}
                label="Jumlah Soal"
                value="33 Soal"
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" className="h-12 w-full text-base" onClick={onStart}>
                  <Play className="!h-4 !w-4" />
                  Mulai Ujian
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Memulai sesi ujian. Timer akan otomatis berjalan.
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>

        <div className="mt-8 mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5" />
          Hasil Ujian
        </div>

        <Card>
          <CardContent className="p-2 sm:p-3">
            <ul className="divide-y">
              {HISTORY.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between gap-3 p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{h.title}</div>
                    <div className="text-xs text-muted-foreground">{h.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {h.released ? (
                      <Badge className="border-success/30 bg-success/10 text-success hover:bg-success/10">
                        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success" />
                        Nilai keluar
                      </Badge>
                    ) : (
                      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/10">
                        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Menunggu
                      </Badge>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            size="sm"
                            variant={h.released ? "default" : "outline"}
                            disabled={!h.released}
                            onClick={() => setResultOpen(h)}
                            className="h-9"
                          >
                            Lihat
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {h.released
                          ? "Lihat rincian nilai ujian ini"
                          : "Nilai belum dirilis oleh dosen"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!resultOpen} onOpenChange={(o) => !o && setResultOpen(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{resultOpen?.title}</DialogTitle>
            <DialogDescription>{resultOpen?.date}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/30 p-4 text-center">
            <div className="text-xs text-muted-foreground">Nilai Akhir</div>
            <div className="mt-1 text-4xl font-bold text-brand">
              {resultOpen?.score}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-brand" />
          <span className="text-sm font-semibold">UjianOnline</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="gap-1.5 border-success/30 bg-success/10 text-success"
          >
            <Wifi className="h-3 w-3" />
            Online
          </Badge>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-right leading-tight">
              <div className="text-sm font-medium">Andi Pratama</div>
              <div className="text-xs text-muted-foreground">NPM 220110001</div>
            </div>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-brand-soft text-brand">AP</AvatarFallback>
          </Avatar>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Keluar dari akun</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Wifi({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13a10 10 0 0 1 14 0" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M12 20h.01" />
    </svg>
  );
}
