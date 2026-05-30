import { useState } from "react";
import { GraduationCap, LogOut, Users, CircleCheck as CheckCircle2, Loader as Loader2, RotateCcw, Clock as Unlock, Info, CalendarClock, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    name: "TIF-3A - Algoritma & Struktur Data",
    schedule: "Senin, 08:00 - 09:40",
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
    name: "TIF-3B - Algoritma & Struktur Data",
    schedule: "Selasa, 10:00 - 11:40",
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

interface LecturerDashboardProps {
  onLogout: () => void;
}

export function LecturerDashboard({ onLogout }: LecturerDashboardProps) {
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
                {cls.schedule} - {cls.students.length} peserta
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
                          <span className="text-muted-foreground">-</span>
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

function ChevronDown({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
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
          <DialogTitle>{student?.name ?? "-"}</DialogTitle>
          <DialogDescription>
            NPM <span className="font-mono">{student?.npm}</span> -{" "}
            {student?.status}
          </DialogDescription>
        </DialogHeader>

        {!detail ? (
          <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Rincian belum tersedia. Peserta belum menyelesaikan ujian.
          </div>
        ) : (
          <div className="space-y-4">
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
          <span className="font-semibold text-foreground">{stat.correct}</span> benar -{" "}
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
