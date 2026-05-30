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
  LayoutGrid,
  LogOut,
  Users,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
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
import { cn } from "@/lib/utils";

type Page = "login" | "dashboard" | "exam" | "lecturer";

const TOTAL_QUESTIONS = 33;

const QUESTION_TEXT =
  "Diberikan sebuah array berisi N angka acak. Algoritma pengurutan manakah yang memiliki kompleksitas waktu kasus terburuk O(n log n) dan bersifat stabil?";

const OPTIONS = [
  { key: "A", text: "Quick Sort" },
  { key: "B", text: "Merge Sort" },
  { key: "C", text: "Bubble Sort" },
  { key: "D", text: "Selection Sort" },
];

const STUDENTS = [
  { name: "Andi Pratama", status: "Ongoing", score: null },
  { name: "Bella Sari", status: "Completed", score: 88 },
  { name: "Citra Dewi", status: "Locked", score: null },
  { name: "Dimas Putra", status: "Completed", score: 92 },
  { name: "Eka Wijaya", status: "Ongoing", score: null },
  { name: "Farah Nabila", status: "Completed", score: 76 },
];

export default function ExamApp() {
  const [page, setPage] = useState<Page>("login");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {page === "login" && <LoginView onLogin={() => setPage("dashboard")} />}
      {page === "dashboard" && (
        <StudentDashboard
          onStart={() => setPage("exam")}
          onSwitchRole={() => setPage("lecturer")}
          onLogout={() => setPage("login")}
        />
      )}
      {page === "exam" && <ExamView onFinish={() => setPage("dashboard")} />}
      {page === "lecturer" && (
        <LecturerDashboard
          onBack={() => setPage("dashboard")}
          onLogout={() => setPage("login")}
        />
      )}
    </div>
  );
}

/* ----------------------------- LOGIN ----------------------------- */

function LoginView({ onLogin }: { onLogin: () => void }) {
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

        <div className="mt-10">
          <Button
            size="lg"
            onClick={onLogin}
            className="h-14 w-full text-base font-medium"
          >
            <Mail className="!h-5 !w-5" />
            Masuk dengan Google Classroom
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Dengan masuk Anda menyetujui kebijakan integritas akademik.
          </p>
        </div>
      </div>
    </main>
  );
}

/* --------------------------- DASHBOARD --------------------------- */

function TopBar({
  onLogout,
  onSwitchRole,
}: {
  onLogout: () => void;
  onSwitchRole?: () => void;
}) {
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
              <div className="text-xs text-muted-foreground">
                NIM 220110xxx
              </div>
            </div>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-brand-soft text-brand">
              AP
            </AvatarFallback>
          </Avatar>
          {onSwitchRole && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onSwitchRole}
              className="hidden md:inline-flex"
            >
              Tampilan Dosen
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function StudentDashboard({
  onStart,
  onSwitchRole,
  onLogout,
}: {
  onStart: () => void;
  onSwitchRole: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <TopBar onLogout={onLogout} onSwitchRole={onSwitchRole} />
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
            <Button size="lg" className="h-12 w-full text-base" onClick={onStart}>
              <Play className="!h-4 !w-4" />
              Mulai Ujian
            </Button>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="mt-6 w-full md:hidden"
          onClick={onSwitchRole}
        >
          Lihat Tampilan Dosen
        </Button>
      </main>
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

  const setAnswer = (val: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = val;
      return next;
    });
  };

  const goto = (i: number) => setCurrent(Math.max(0, Math.min(TOTAL_QUESTIONS - 1, i)));

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              UAS - Algoritma
            </div>
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
            <div className="rounded-md border bg-muted px-3 py-1.5 font-mono text-sm font-semibold tabular-nums">
              <Clock className="mr-1 inline h-3.5 w-3.5 -translate-y-0.5" />
              01:39:45
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={onFinish}
              className="h-9"
            >
              Selesai
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-10">
        {/* Question column */}
        <section className="lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Soal {current + 1} dari {TOTAL_QUESTIONS}
            </span>
            <span className="text-xs text-muted-foreground">
              Terjawab: {answers.filter(Boolean).length}/{TOTAL_QUESTIONS}
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
                        selected
                          ? "border-brand bg-brand-soft"
                          : "border-border bg-card",
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

          {/* Nav buttons */}
          <div className="mt-5 grid grid-cols-2 gap-3">
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
            <Button
              size="lg"
              className="h-12"
              disabled={current === TOTAL_QUESTIONS - 1}
              onClick={() => goto(current + 1)}
            >
              Selanjutnya
              <ChevronRight className="!h-4 !w-4" />
            </Button>
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
                <QuestionGrid
                  answers={answers}
                  current={current}
                  onSelect={goto}
                />
                <Legend />
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      {/* Floating map button - mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-5 right-5 z-40 h-14 rounded-full shadow-lg lg:hidden"
          >
            <LayoutGrid className="!h-5 !w-5" />
            Peta Soal
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>Peta Soal</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <QuestionGrid answers={answers} current={current} onSelect={goto} />
            <Legend />
          </div>
        </SheetContent>
      </Sheet>
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
          <button
            key={i}
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

function LecturerDashboard({
  onBack,
  onLogout,
}: {
  onBack: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-brand" />
            <span className="text-sm font-semibold">Panel Dosen</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onBack}>
              Mahasiswa
            </Button>
            <Button size="icon" variant="ghost" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">UAS - Algoritma</h1>
          <p className="text-sm text-muted-foreground">
            Pantau aktivitas peserta secara real-time.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard
            icon={<Users className="h-4 w-4" />}
            label="Total Peserta"
            value="42"
            tone="default"
          />
          <MetricCard
            icon={<Loader2 className="h-4 w-4" />}
            label="Sedang Mengerjakan"
            value="18"
            tone="brand"
          />
          <MetricCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Selesai"
            value="21"
            tone="success"
          />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Daftar Peserta</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {STUDENTS.map((s) => (
                    <TableRow key={s.name}>
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
                      <TableCell className="text-right">
                        {s.status === "Completed" ? (
                          <Button size="sm" variant="outline">
                            <Unlock className="!h-3.5 !w-3.5" />
                            Buka Retake
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <RotateCcw className="!h-3.5 !w-3.5" />
                            Reset Device
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
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
      <Badge className="bg-brand-soft text-brand hover:bg-brand-soft">
        Ongoing
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Locked
    </Badge>
  );
}
