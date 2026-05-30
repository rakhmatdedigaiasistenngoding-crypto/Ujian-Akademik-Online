import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Wifi,
  Clock,
  FileText,
  Play,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  LogOut,
  Users,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Unlock,
  Info,
  ClipboardList,
  Send,
  CalendarClock,
  Hourglass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type Page = "login" | "dashboard" | "exam" | "lecturer";
type Role = "student" | "lecturer";

const TOTAL_QUESTIONS = 33;

const QUESTION_TEXT =
  "Diberikan sebuah array berisi N angka acak. Algoritma pengurutan manakah yang memiliki kompleksitas waktu kasus terburuk O(n log n) dan bersifat stabil?";

const OPTIONS = [
  { key: "A", text: "Quick Sort" },
  { key: "B", text: "Merge Sort" },
  { key: "C", text: "Bubble Sort" },
  { key: "D", text: "Selection Sort" },
];

type LevelStat = { total: number; correct: number };
type StudentDetail = {
  startedAt: string;
  finishedAt: string;
  duration: string;
  levels: { mudah: LevelStat; sedang: LevelStat; sulit: LevelStat };
};

type Student = {
  npm: string;
  name: string;
  status: "Ongoing" | "Locked" | "Completed";
  score: number | null;
  detail?: StudentDetail;
};

type ClassGroup = { id: string; name: string; schedule: string; students: Student[] };

const CLASSES: ClassGroup[] = [
  {
    id: "tif-a",
    name: "TIF-3A · Algoritma & Struktur Data",
    schedule: "Senin, 08:00 – 09:40",
    students: [
      {
        npm: "220110001",
        name: "Andi Pratama",
        status: "Ongoing",
        score: null,
      },
      {
        npm: "220110002",
        name: "Bella Sari",
        status: "Completed",
        score: 88,
        detail: {
          startedAt: "08:00",
          finishedAt: "09:28",
          duration: "1j 28m",
          levels: {
            mudah: { total: 10, correct: 10 },
            sedang: { total: 15, correct: 13 },
            sulit: { total: 8, correct: 6 },
          },
        },
      },
      { npm: "220110003", name: "Citra Dewi", status: "Locked", score: null },
      {
        npm: "220110004",
        name: "Dimas Putra",
        status: "Completed",
        score: 92,
        detail: {
          startedAt: "08:00",
          finishedAt: "09:35",
          duration: "1j 35m",
          levels: {
            mudah: { total: 10, correct: 10 },
            sedang: { total: 15, correct: 14 },
            sulit: { total: 8, correct: 7 },
          },
        },
      },
    ],
  },
  {
    id: "tif-b",
    name: "TIF-3B · Algoritma & Struktur Data",
    schedule: "Selasa, 10:00 – 11:40",
    students: [
      { npm: "220110021", name: "Eka Wijaya", status: "Ongoing", score: null },
      {
        npm: "220110022",
        name: "Farah Nabila",
        status: "Completed",
        score: 76,
        detail: {
          startedAt: "10:00",
          finishedAt: "11:32",
          duration: "1j 32m",
          levels: {
            mudah: { total: 10, correct: 9 },
            sedang: { total: 15, correct: 10 },
            sulit: { total: 8, correct: 4 },
          },
        },
      },
      { npm: "220110023", name: "Gilang Ramadhan", status: "Ongoing", score: null },
      {
        npm: "220110024",
        name: "Hana Maulida",
        status: "Completed",
        score: 81,
        detail: {
          startedAt: "10:00",
          finishedAt: "11:30",
          duration: "1j 30m",
          levels: {
            mudah: { total: 10, correct: 10 },
            sedang: { total: 15, correct: 12 },
            sulit: { total: 8, correct: 5 },
          },
        },
      },
    ],
  },
];

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

export default function ExamApp() {
  const [page, setPage] = useState<Page>("login");

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background text-foreground">
        {page === "login" && (
          <LoginView
            onLogin={(role) => setPage(role === "lecturer" ? "lecturer" : "dashboard")}
          />
        )}
        {page === "dashboard" && (
          <StudentDashboard
            onStart={() => setPage("exam")}
            onLogout={() => setPage("login")}
          />
        )}
        {page === "exam" && <ExamView onFinish={() => setPage("dashboard")} />}
        {page === "lecturer" && (
          <LecturerDashboard onLogout={() => setPage("login")} />
        )}
      </div>
    </TooltipProvider>
  );
}

/* ----------------------------- LOGIN ----------------------------- */

function LoginView({ onLogin }: { onLogin: (role: Role) => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft">
          <GraduationCap className="h-8 w-8 text-brand" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Sistem Ujian Berbasis Online
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Masuk untuk mengakses jadwal & sesi ujian Anda.
        </p>

        <div className="mt-10 space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                onClick={() => onLogin("student")}
                className="h-14 w-full text-base font-medium"
              >
                <Mail className="!h-5 !w-5" />
                Masuk dengan Google Classroom
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Sistem mendeteksi peran dari akun Google Anda secara otomatis.
            </TooltipContent>
          </Tooltip>

          <Button
            size="lg"
            variant="outline"
            onClick={() => onLogin("lecturer")}
            className="h-12 w-full text-sm"
          >
            Demo: Masuk sebagai Dosen
          </Button>

          <p className="mt-4 text-xs text-muted-foreground">
            Akun mahasiswa otomatis masuk ke panel ujian; akun dosen langsung ke
            panel pemantauan.
          </p>
        </div>
      </div>
    </main>
  );
}

/* --------------------------- DASHBOARD --------------------------- */

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

function StudentDashboard({
  onStart,
  onLogout,
}: {
  onStart: () => void;
  onLogout: () => void;
}) {
  const [resultOpen, setResultOpen] = useState<HistoryItem | null>(null);

  return (
    <>
      <TopBar onLogout={onLogout} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Halo, Andi 👋</h1>
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
                  Prodi Teknik Informatika · Semester Ganjil 2025
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

        {/* HASIL UJIAN */}
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

/* ------------------------------ EXAM ----------------------------- */

function ExamView({ onFinish }: { onFinish: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(TOTAL_QUESTIONS).fill(null),
  );
  const [mapOpen, setMapOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const answered = answers.filter(Boolean).length;
  const unanswered = TOTAL_QUESTIONS - answered;

  const setAnswer = (val: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = val;
      return next;
    });
  };

  const goto = (i: number) => {
    setCurrent(Math.max(0, Math.min(TOTAL_QUESTIONS - 1, i)));
    setMapOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">UAS - Algoritma</div>
            <div className="mt-0.5 flex items-center gap-2">
              <Badge
                variant="outline"
                className="h-5 gap-1 border-success/30 bg-success/10 px-1.5 text-[10px] text-success"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Online
              </Badge>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Andi Pratama
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-md border bg-muted px-3 py-1.5 font-mono text-sm font-semibold tabular-nums">
                  <Clock className="mr-1 inline h-3.5 w-3.5 -translate-y-0.5" />
                  01:39:45
                </div>
              </TooltipTrigger>
              <TooltipContent>Sisa waktu ujian</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setConfirmOpen(true)}
                  className="h-9"
                >
                  Selesai
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mengirim jawaban & mengakhiri ujian.</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-10">
        <section className="lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Soal {current + 1} dari {TOTAL_QUESTIONS}
            </span>
            <span className="text-xs text-muted-foreground">
              Terjawab: {answered}/{TOTAL_QUESTIONS}
            </span>
          </div>

          <Card>
            <CardContent className="space-y-5 p-5 sm:p-6">
              <p className="text-base leading-relaxed">{QUESTION_TEXT}</p>

              <div className="space-y-2.5">
                {OPTIONS.map((opt) => {
                  const selected = answers[current] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setAnswer(opt.key)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left text-sm transition-colors",
                        "hover:bg-muted/50",
                        selected ? "border-brand bg-brand-soft" : "border-border bg-card",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                          selected
                            ? "border-brand bg-brand text-brand-foreground"
                            : "border-border bg-muted text-foreground",
                        )}
                      >
                        {opt.key}
                      </span>
                      <span className="font-medium">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12"
                  disabled={current === 0}
                  onClick={() => goto(current - 1)}
                >
                  <ChevronLeft className="!h-4 !w-4" />
                  Sebelumnya
                </Button>
              </TooltipTrigger>
              <TooltipContent>Kembali ke soal sebelumnya</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  className="h-12"
                  disabled={current === TOTAL_QUESTIONS - 1}
                  onClick={() => goto(current + 1)}
                >
                  Selanjutnya
                  <ChevronRight className="!h-4 !w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lanjut ke soal berikutnya</TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Question map - desktop */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Peta Soal</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionGrid answers={answers} current={current} onSelect={goto} />
                <Legend />
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      {/* Floating map button - mobile */}
      <Sheet open={mapOpen} onOpenChange={setMapOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                size="lg"
                className="fixed bottom-5 right-5 z-40 h-14 rounded-full shadow-lg lg:hidden"
              >
                <LayoutGrid className="!h-5 !w-5" />
                Peta Soal
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">Lompat ke nomor soal tertentu</TooltipContent>
        </Tooltip>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>Peta Soal</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <QuestionGrid answers={answers} current={current} onSelect={goto} />
            <Legend />
          </div>
          <SheetClose className="sr-only">Tutup</SheetClose>
        </SheetContent>
      </Sheet>

      {/* Submit confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-brand" />
              Kirim jawaban sekarang?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Pastikan semua jawaban sudah benar. Setelah dikirim, Anda
                  tidak dapat mengubahnya kembali.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border bg-success/10 p-3 text-center">
                    <div className="text-xs text-success">Terjawab</div>
                    <div className="text-lg font-bold text-success">
                      {answered}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-md border p-3 text-center",
                      unanswered > 0
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
                        : "bg-muted",
                    )}
                  >
                    <div className="text-xs">Belum dijawab</div>
                    <div className="text-lg font-bold">{unanswered}</div>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Periksa lagi</AlertDialogCancel>
            <AlertDialogAction onClick={onFinish}>
              <Send className="!h-3.5 !w-3.5" />
              Kirim & Selesai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function QuestionGrid({
  answers,
  current,
  onSelect,
}: {
  answers: (string | null)[];
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-5">
      {answers.map((a, i) => {
        const answered = a !== null;
        const isCurrent = i === current;
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSelect(i)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-md border text-sm font-semibold transition-colors",
                  answered
                    ? "border-success bg-success text-success-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted",
                  isCurrent && "ring-2 ring-brand ring-offset-2 ring-offset-card",
                )}
              >
                {i + 1}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Soal {i + 1} · {answered ? "Sudah dijawab" : "Belum dijawab"}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

function Legend() {
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

/* --------------------------- LECTURER --------------------------- */

function LecturerDashboard({ onLogout }: { onLogout: () => void }) {
  const [selected, setSelected] = useState<Student | null>(null);

  const totalPeserta = CLASSES.reduce((n, c) => n + c.students.length, 0);
  const ongoing = CLASSES.reduce(
    (n, c) => n + c.students.filter((s) => s.status === "Ongoing").length,
    0,
  );
  const completed = CLASSES.reduce(
    (n, c) => n + c.students.filter((s) => s.status === "Completed").length,
    0,
  );

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-brand" />
            <span className="text-sm font-semibold">Panel Dosen</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-sm font-medium">Dr. Rina Hartanti</div>
              <div className="text-xs text-muted-foreground">Dosen Pengampu</div>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-brand-soft text-brand">RH</AvatarFallback>
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

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">UAS - Algoritma</h1>
            <p className="text-sm text-muted-foreground">
              Pantau aktivitas peserta secara real-time.
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="shrink-0">
                <Info className="!h-3.5 !w-3.5" />
                Bantuan Aksi
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 text-sm">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 font-semibold">
                    <RotateCcw className="h-4 w-4 text-brand" />
                    Reset Device
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Memutus sesi peserta dari perangkat lama agar bisa login
                    kembali di perangkat lain. Jawaban yang sudah tersimpan
                    tidak hilang.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold">
                    <Unlock className="h-4 w-4 text-success" />
                    Buka Retake
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Memberi izin peserta yang sudah <b>Completed</b> untuk
                    mengulang ujian. Nilai sebelumnya diarsipkan.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard
            icon={<Users className="h-4 w-4" />}
            label="Total Peserta"
            value={String(totalPeserta)}
            tone="default"
          />
          <MetricCard
            icon={<Loader2 className="h-4 w-4" />}
            label="Sedang Mengerjakan"
            value={String(ongoing)}
            tone="brand"
          />
          <MetricCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Selesai"
            value={String(completed)}
            tone="success"
          />
        </div>

        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Daftar Kelas
        </div>

        <div className="space-y-3">
          {CLASSES.map((cls) => (
            <ClassSection
              key={cls.id}
              cls={cls}
              onSelectStudent={(s) => setSelected(s)}
            />
          ))}
        </div>
      </main>

      <StudentDetailDialog
        student={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function ClassSection({
  cls,
  onSelectStudent,
}: {
  cls: ClassGroup;
  onSelectStudent: (s: Student) => void;
}) {
  const [open, setOpen] = useState(false);
  const ongoing = cls.students.filter((s) => s.status === "Ongoing").length;
  const completed = cls.students.filter((s) => s.status === "Completed").length;

  return (
    <Card className="overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/40",
              open && "bg-muted/30",
            )}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{cls.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {cls.schedule} · {cls.students.length} peserta
              </div>
            </div>
            <div className="hidden gap-2 text-xs sm:flex">
              <Badge variant="outline" className="border-brand/30 bg-brand-soft text-brand">
                {ongoing} mengerjakan
              </Badge>
              <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                {completed} selesai
              </Badge>
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NPM</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cls.students.map((s) => (
                    <TableRow
                      key={s.npm}
                      className="cursor-pointer"
                      onClick={() => onSelectStudent(s)}
                    >
                      <TableCell className="font-mono text-xs">{s.npm}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} />
                      </TableCell>
                      <TableCell>
                        {s.score !== null ? (
                          <span className="font-semibold">{s.score}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {s.status === "Completed" ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Unlock className="!h-3.5 !w-3.5" />
                                <span className="hidden sm:inline">Buka Retake</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Izinkan peserta mengulang ujian.
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline">
                                <RotateCcw className="!h-3.5 !w-3.5" />
                                <span className="hidden sm:inline">Reset Device</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Putuskan sesi perangkat lama.
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function StudentDetailDialog({
  student,
  onClose,
}: {
  student: Student | null;
  onClose: () => void;
}) {
  const open = !!student;
  const detail = student?.detail;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{student?.name ?? "—"}</DialogTitle>
          <DialogDescription>
            NPM <span className="font-mono">{student?.npm}</span> ·{" "}
            {student?.status}
          </DialogDescription>
        </DialogHeader>

        {!detail ? (
          <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Rincian belum tersedia. Peserta belum menyelesaikan ujian.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Score summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md border bg-muted/30 p-3 text-center">
                <div className="text-[10px] uppercase text-muted-foreground">
                  Nilai
                </div>
                <div className="text-2xl font-bold text-brand">
                  {student?.score}
                </div>
              </div>
              <div className="rounded-md border bg-success/10 p-3 text-center">
                <div className="text-[10px] uppercase text-success">Benar</div>
                <div className="text-2xl font-bold text-success">
                  {detail.levels.mudah.correct +
                    detail.levels.sedang.correct +
                    detail.levels.sulit.correct}
                </div>
              </div>
              <div className="rounded-md border bg-destructive/10 p-3 text-center">
                <div className="text-[10px] uppercase text-destructive">Salah</div>
                <div className="text-2xl font-bold text-destructive">
                  {detail.levels.mudah.total -
                    detail.levels.mudah.correct +
                    (detail.levels.sedang.total - detail.levels.sedang.correct) +
                    (detail.levels.sulit.total - detail.levels.sulit.correct)}
                </div>
              </div>
            </div>

            {/* Chart per level */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Rincian per Level
              </div>
              <div className="space-y-3">
                <LevelBar label="Mudah" stat={detail.levels.mudah} tone="success" />
                <LevelBar label="Sedang" stat={detail.levels.sedang} tone="brand" />
                <LevelBar label="Sulit" stat={detail.levels.sulit} tone="destructive" />
              </div>
            </div>

            {/* Time info */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <TimeTile
                icon={<CalendarClock className="h-3.5 w-3.5" />}
                label="Mulai"
                value={detail.startedAt}
              />
              <TimeTile
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                label="Selesai"
                value={detail.finishedAt}
              />
              <TimeTile
                icon={<Hourglass className="h-3.5 w-3.5" />}
                label="Durasi"
                value={detail.duration}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LevelBar({
  label,
  stat,
  tone,
}: {
  label: string;
  stat: LevelStat;
  tone: "success" | "brand" | "destructive";
}) {
  const pct = stat.total === 0 ? 0 : Math.round((stat.correct / stat.total) * 100);
  const wrong = stat.total - stat.correct;
  const fillClass =
    tone === "success" ? "bg-success" : tone === "brand" ? "bg-brand" : "bg-destructive";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{stat.correct}</span> benar ·{" "}
          {wrong} salah <span className="text-muted-foreground/70">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", fillClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TimeTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border bg-muted/30 p-2 text-center">
      <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "default" | "brand" | "success";
}) {
  const toneClass =
    tone === "brand"
      ? "bg-brand-soft text-brand"
      : tone === "success"
        ? "bg-success/10 text-success"
        : "bg-muted text-foreground";
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", toneClass)}>
          {icon}
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Completed")
    return (
      <Badge className="border-success/30 bg-success/10 text-success hover:bg-success/10">
        Completed
      </Badge>
    );
  if (status === "Ongoing")
    return (
      <Badge className="bg-brand-soft text-brand hover:bg-brand-soft">Ongoing</Badge>
    );
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Locked
    </Badge>
  );
}
