import { useState, useEffect } from "react";
import { GraduationCap, LogOut, Users, CircleCheck as CheckCircle2, Loader as Loader2, RotateCcw, Clock as Unlock, Info, CalendarClock, Hourglass, Download, Share2, Mail, MessageSquare } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { exportToExcel, exportToPDF, openWhatsAppShare, openEmailShare } from "@/lib/exportUtils";

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
export function LecturerMonitoringTab() {
  const { user } = useAuthStore();
  const [selected, setSelected] = useState<Student | null>(null);
  
  const [exams, setExams] = useState<{id: string, title: string}[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("none");
  const [classesData, setClassesData] = useState<ClassGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // 1. Fetch available exams
  useEffect(() => {
    const fetchExams = async () => {
      const { data } = await supabase.from('exam_configs').select('id, title').order('title');
      if (data && data.length > 0) {
        setExams(data);
        setSelectedExamId(data[0].id);
      } else {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, []);

  // 2. Fetch monitoring data for selected exam
  const fetchMonitoringData = async () => {
    if (!selectedExamId || selectedExamId === "none") return;
    
    try {
      setIsLoading(true);
      // Fetch classes linked to exam
      const { data: examClasses } = await supabase.from('exam_classes').select('class_id').eq('exam_id', selectedExamId);
      if (!examClasses || examClasses.length === 0) {
        setClassesData([]);
        return;
      }
      const classIds = examClasses.map(ec => ec.class_id);
      
      // Fetch classes details
      const { data: classes } = await supabase.from('classes').select('*').in('id', classIds).order('name');
      if (!classes) return;

      // Fetch students in those classes
      const { data: students } = await supabase.from('class_students').select('*').in('class_id', classIds);
      if (!students) return;

      // Fetch exam sessions (join with users to get email)
      const { data: sessions } = await supabase
        .from('exam_sessions')
        .select(`
          *,
          users ( email )
        `)
        .eq('exam_id', selectedExamId);

      const sessionByEmail: Record<string, any> = {};
      if (sessions) {
        sessions.forEach(s => {
          if (s.users && s.users.email) {
            sessionByEmail[s.users.email] = s;
          }
        });
      }

      const groupedData: ClassGroup[] = classes.map(cls => {
        const clsStudents = students.filter(s => s.class_id === cls.id).map(student => {
          const session = sessionByEmail[student.email];
          let status: "Ongoing" | "Locked" | "Completed" = "Locked";
          
          if (session) {
             status = session.status === 'active' ? 'Ongoing' : 'Completed';
          }

          let durationStr = "-";
          if (session && session.started_at && session.finished_at) {
            const diff = new Date(session.finished_at).getTime() - new Date(session.started_at).getTime();
            const minutes = Math.floor(diff / 60000);
            durationStr = `${Math.floor(minutes / 60)}j ${minutes % 60}m`;
          }

          return {
            npm: student.npm,
            name: student.name,
            status: status,
            score: session?.score ?? null,
            session_id: session?.id,
            student_id: session?.student_id,
            attempt_number: session?.attempt_number ?? 1,
            full_finished_at: session?.finished_at ? new Date(session.finished_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : "-",
            detail: session ? {
              startedAt: new Date(session.started_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              finishedAt: session.finished_at ? new Date(session.finished_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-",
              duration: durationStr,
              levels: { mudah: { total: 0, correct: 0 }, sedang: { total: 0, correct: 0 }, sulit: { total: 0, correct: 0 } }
            } : undefined
          };
        });

        // Sort students by NPM
        clsStudents.sort((a, b) => a.npm.localeCompare(b.npm));

        return {
          id: cls.id,
          name: cls.name,
          schedule: cls.schedule || "-",
          students: clsStudents
        };
      });

      setClassesData(groupedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch monitoring data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
    // Auto refresh every 10 seconds
    const intervalId = setInterval(() => {
      fetchMonitoringData();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [selectedExamId]);

  const totalPeserta = classesData.reduce((n, c) => n + c.students.length, 0);
  const ongoing = classesData.reduce(
    (n, c) => n + c.students.filter((s) => s.status === "Ongoing").length,
    0,
  );
  const completed = classesData.reduce(
    (n, c) => n + c.students.filter((s) => s.status === "Completed").length,
    0,
  );

  const hasData = selectedExamId !== "none" && classesData.length > 0;

  return (
    <div className="w-full">
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Select value={selectedExamId} onValueChange={setSelectedExamId}>
              <SelectTrigger className="w-[280px] bg-background font-semibold">
                <SelectValue placeholder="Pilih Ujian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Pilih Ujian</SelectItem>
                {exams.map(exam => (
                  <SelectItem key={exam.id} value={exam.id}>{exam.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <RotateCcw className={cn("h-3 w-3", isLoading && "animate-spin")} />
              Diperbarui: {lastUpdated.toLocaleTimeString()}
            </span>
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

          {/* Tombol Ekspor & Bagikan Dosen */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" disabled={!hasData}>
                  <Download className="mr-2 !h-3.5 !w-3.5" />
                  Ekspor Nilai
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  if (!selectedExamId || selectedExamId === "none") return alert("Pilih ujian terlebih dahulu");
                  const examTitle = exams.find(e => e.id === selectedExamId)?.title || "Ujian";
                  const data: any[] = [];
                  classesData.forEach(cls => {
                    cls.students.forEach(s => {
                      data.push({ 
                        "Kelas": cls.name, 
                        "NPM": s.npm, 
                        "Nama": s.name, 
                        "Status": s.status, 
                        "Percobaan Ke": (s as any).attempt_number || "-",
                        "Waktu Selesai": (s as any).full_finished_at || "-",
                        "Nilai": s.score ?? "-" 
                      });
                    });
                  });
                  if (data.length === 0) return alert("Belum ada data peserta");
                  exportToExcel(data, `Rekap_${examTitle}`);
                }}>
                  Unduh Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  if (!selectedExamId || selectedExamId === "none") return alert("Pilih ujian terlebih dahulu");
                  const examTitle = exams.find(e => e.id === selectedExamId)?.title || "Ujian";
                  const rows: any[][] = [];
                  classesData.forEach(cls => {
                    cls.students.forEach(s => rows.push([
                      cls.name, s.npm, s.name, s.status, 
                      (s as any).attempt_number || "-",
                      (s as any).full_finished_at || "-",
                      s.score ?? "-"
                    ]));
                  });
                  if (rows.length === 0) return alert("Belum ada data peserta");
                  exportToPDF(`Rekap Nilai: ${examTitle}`, ["Kelas", "NPM", "Nama", "Status", "Ke-", "Waktu Selesai", "Nilai"], rows, `Rekap_${examTitle}`);
                }}>
                  Unduh PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fitur Bagikan disembunyikan sementara */}
            {false && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-brand text-white hover:bg-brand/90" disabled={!hasData}>
                    <Share2 className="mr-2 !h-3.5 !w-3.5" />
                    Bagikan Arsip
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    if (!selectedExamId || selectedExamId === "none") return alert("Pilih ujian terlebih dahulu");
                    const examTitle = exams.find(e => e.id === selectedExamId)?.title || "Ujian";
                    const msg = `Halo! Ini pengingat bahwa ujian *${examTitle}* telah selesai/sedang berlangsung. Cek dasbor untuk mengunduh rekap nilai lengkap.`;
                    openWhatsAppShare(msg);
                  }}>
                    <MessageSquare className="mr-2 h-4 w-4 text-green-600" /> Kirim ke WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    if (!selectedExamId || selectedExamId === "none") return alert("Pilih ujian terlebih dahulu");
                    if (!user) return;
                    const examTitle = exams.find(e => e.id === selectedExamId)?.title || "Ujian";
                    let body = `Halo ${user.name},\n\nRangkuman kelas untuk ujian ${examTitle}:\n\n`;
                    classesData.forEach(cls => {
                      const done = cls.students.filter(s => s.status === "Completed").length;
                      body += `- Kelas ${cls.name}: ${done}/${cls.students.length} Selesai\n`;
                    });
                    body += `\nSilakan masuk ke dasbor UjianOnline untuk mengunduh Excel/PDF.\n\nTerima kasih.`;
                    openEmailShare(user.email, `Arsip Nilai: ${examTitle}`, body);
                  }}>
                    <Mail className="mr-2 h-4 w-4 text-blue-600" /> Kirim ke Email Saya
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
          {classesData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Belum ada kelas yang terhubung dengan ujian ini atau belum ada peserta.
              </CardContent>
            </Card>
          ) : (
            classesData.map((cls) => (
              <ClassSection
                key={cls.id}
                cls={cls}
                onSelectStudent={(s) => setSelected(s)}
                examId={selectedExamId}
                onRefresh={fetchMonitoringData}
              />
            ))
          )}
        </div>
      </main>

      <StudentDetailDialog
        student={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function ClassSection({
  cls,
  onSelectStudent,
  examId,
  onRefresh
}: {
  cls: ClassGroup;
  onSelectStudent: (s: Student) => void;
  examId: string;
  onRefresh: () => void;
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
                              <Button size="sm" variant="outline" onClick={async () => {
                                if (useAuthStore.getState().user?.id === 'lecturer-001') {
                                  alert("Aksi ini tidak bisa dilakukan di mode demo.");
                                  return;
                                }
                                if (!confirm(`Izinkan ${s.name} mengulang ujian? Sesi sebelumnya akan dihapus dan nilai direset.`)) return;
                                
                                try {
                                  // @ts-ignore
                                  if (!s.session_id) return;
                                  const { error } = await supabase.from('exam_sessions').delete().eq('id', (s as any).session_id);
                                  if (error) throw error;
                                  onRefresh();
                                } catch(e: any) {
                                  alert("Gagal membuka retake: " + e.message);
                                }
                              }}>
                                <Unlock className="!h-3.5 !w-3.5" />
                                <span className="hidden sm:inline">Buka Retake</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Izinkan peserta mengulang ujian.
                            </TooltipContent>
                          </Tooltip>
                        ) : s.status === "Ongoing" ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline" onClick={async () => {
                                if (useAuthStore.getState().user?.id === 'lecturer-001') {
                                  alert("Aksi ini tidak bisa dilakukan di mode demo.");
                                  return;
                                }
                                if (!confirm(`Selesaikan ujian ${s.name} secara paksa?`)) return;
                                
                                try {
                                  // @ts-ignore
                                  if (!s.session_id) return;
                                  const { error } = await supabase.from('exam_sessions').update({ status: 'submitted', finished_at: new Date().toISOString() }).eq('id', (s as any).session_id);
                                  if (error) throw error;
                                  onRefresh();
                                } catch(e: any) {
                                  alert("Gagal menyelesaikan sesi: " + e.message);
                                }
                              }}>
                                <RotateCcw className="!h-3.5 !w-3.5" />
                                <span className="hidden sm:inline">Akhiri Sesi</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Selesaikan sesi ujian secara paksa.
                            </TooltipContent>
                          </Tooltip>
                        ) : null}
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
