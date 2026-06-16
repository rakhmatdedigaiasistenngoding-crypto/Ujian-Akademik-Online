import { useState, useEffect } from "react";
import {
  Clock,
  FileText,
  Play,
  ClipboardList,
  LogOut,
  GraduationCap,
  Wifi,
  Calendar,
  RotateCcw,
  Download,
  Share2,
  Mail,
  MessageSquare,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ExamConfig } from "@/types/exam";
import { exportToExcel, exportToPDF, openWhatsAppShare, openEmailShare } from "@/lib/exportUtils";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useExamStore } from "@/stores/examStore";

type HistoryItem = {
  id: string;
  title: string;
  date: string;
  released: boolean;
  score: number | null;
};



interface StudentDashboardProps {
  onStart: (config: ExamConfig) => void;
  onLogout: () => void;
}

export function StudentDashboard({ onStart, onLogout }: StudentDashboardProps) {
  const [resultOpen, setResultOpen] = useState<HistoryItem | null>(null);
  const [configs, setConfigs] = useState<ExamConfig[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { error, isLoading } = useExamStore();

  useEffect(() => {
    if (error) {
      alert("Gagal memulai ujian: " + error);
    }
  }, [error]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      // 1. Cari kelas mahasiswa berdasarkan email
      const { data: studentClasses } = await supabase.from('class_students').select('class_id').eq('email', user.email);
      const classIds = studentClasses?.map(c => c.class_id) || [];

      let allowedExamIds: string[] = [];
      if (classIds.length > 0) {
        // 2. Cari ujian yang ditugaskan ke kelas-kelas tersebut
        const { data: examClasses } = await supabase.from('exam_classes').select('exam_id').in('class_id', classIds);
        allowedExamIds = examClasses?.map(ec => ec.exam_id) || [];
        allowedExamIds = [...new Set(allowedExamIds)]; // hapus duplikat jika kelas berbeda punya ujian sama
      }

      // 3. Ambil detail ujian yang diizinkan saja
      let configsData: any[] = [];
      if (allowedExamIds.length > 0) {
        const { data } = await supabase.from('exam_configs').select('*').in('id', allowedExamIds);
        if (data) configsData = data;
      }

      // 4. Ambil sesi ujian yang sudah dilakukan mahasiswa ini
      const { data: sessionsData } = await supabase.from('exam_sessions')
        .select('*, exam_configs(title, score_release)')
        .eq('student_id', user.id);
      if (configsData) {
        // Count how many times the student has attempted each exam
        const attemptCounts = configsData.reduce((acc, config) => {
          acc[config.id] = sessionsData ? sessionsData.filter(s => s.exam_id === config.id).length : 0;
          return acc;
        }, {} as Record<string, number>);

        // Filter configs based on max_retakes
        const available = configsData
          .filter(c => attemptCounts[c.id] < (c.max_retakes || 1))
          .map(d => ({
            id: d.id,
            title: d.title,
            duration: d.duration,
            totalQuestions: d.total_questions,
            distribution: d.distribution,
            scoreRelease: d.score_release,
            maxRetakes: d.max_retakes,
            availableFrom: d.available_from,
            availableUntil: d.available_until,
            attemptsUsed: attemptCounts[d.id] || 0,
          }));
        setConfigs(available);
      }

      if (sessionsData) {
        const historyItems = sessionsData
          .filter(s => s.status === 'submitted' || s.status === 'expired')
          .map(s => {
            const config = s.exam_configs as any;
            const dt = new Date(s.finished_at || s.started_at);
            return {
              id: s.id,
              title: `${config?.title || 'Unknown Exam'} (Percobaan ${s.attempt_number || 1})`,
              date: dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              released: config?.score_release === 'immediate',
              score: s.score,
            };
          });
        setHistory(historyItems);
      }
      
      setLoading(false);
    }
    fetchData();
  }, [user]);

  return (
    <>
      <TopBar onLogout={onLogout} user={user} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Halo, {user?.name || "Mahasiswa"}</h1>
          <p className="text-sm text-muted-foreground">
            Berikut daftar ujian aktif untuk Anda.
          </p>
        </div>

        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Daftar Ujian
        </div>

        {loading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">Memuat ujian...</div>
        ) : configs.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">Tidak ada ujian yang tersedia saat ini.</div>
        ) : (
          <div className="space-y-4">
            {configs.map((config) => (
              <Card key={config.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {config.title}
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Tersedia untuk dikerjakan
                      </p>
                    </div>
                    <Badge className="bg-brand-soft text-brand hover:bg-brand-soft">
                      Tersedia
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <InfoTile icon={<Clock className="h-4 w-4" />} label="Durasi" value={`${config.duration} Menit`} />
                    <InfoTile
                      icon={<FileText className="h-4 w-4" />}
                      label="Jumlah Soal"
                      value={`${config.totalQuestions} Soal`}
                    />
                    <div className="col-span-2 grid grid-cols-2 gap-3">
                      <InfoTile
                        icon={<RotateCcw className="h-4 w-4" />}
                        label="Sisa Percobaan"
                        value={`${(config.maxRetakes || 1) - (config.attemptsUsed || 0)} / ${config.maxRetakes || 1}`}
                      />
                      <InfoTile
                        icon={<Calendar className="h-4 w-4" />}
                        label="Batas Akhir"
                        value={config.availableUntil ? new Date(config.availableUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' }) : "Selamanya"}
                      />
                    </div>
                    <div className="col-span-2">
                      <InfoTile
                        icon={<Calendar className="h-4 w-4" />}
                        label="Waktu Mulai"
                        value={config.availableFrom ? new Date(config.availableFrom).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : "Sekarang"}
                      />
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="lg" 
                        className="h-12 w-full text-base" 
                        onClick={() => onStart(config)}
                        disabled={isLoading}
                      >
                        <Play className="!h-4 !w-4" />
                        {isLoading ? "Memproses..." : "Mulai Ujian"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Memulai sesi ujian. Timer akan otomatis berjalan.
                    </TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5" />
          Hasil Ujian
        </div>

        <Card>
          <CardContent className="p-2 sm:p-3">
            <ul className="divide-y">
              {history.length === 0 ? (
                <li className="p-4 text-center text-sm text-muted-foreground">
                  Belum ada riwayat ujian.
                </li>
              ) : (
                history.map((h) => (
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
                ))
              )}
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
          <div className="mt-4 flex gap-2 justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Unduh
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => {
                  if (!resultOpen || !user) return;
                  const data = [{ "Nama Mahasiswa": user.name, "Email": user.email, "Ujian": resultOpen.title, "Tanggal": resultOpen.date, "Nilai": resultOpen.score }];
                  exportToExcel(data, `Nilai_${resultOpen.title}_${user.name}`);
                }}>
                  Unduh Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  if (!resultOpen || !user) return;
                  exportToPDF(`Hasil Ujian: ${resultOpen.title}`, ["Nama", "Email", "Tanggal", "Nilai"], [[user.name, user.email, resultOpen.date, resultOpen.score]], `Nilai_${resultOpen.title}_${user.name}`);
                }}>
                  Unduh PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fitur Bagikan disembunyikan sementara */}
            {false && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Bagikan
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={() => {
                    if (!resultOpen || !user) return;
                    const msg = `Halo! Ini hasil ujian saya:\n\nNama: ${user.name}\nUjian: ${resultOpen.title}\nTanggal: ${resultOpen.date}\n*Nilai: ${resultOpen.score}*\n\nTerima kasih!`;
                    openWhatsAppShare(msg);
                  }}>
                    <MessageSquare className="mr-2 h-4 w-4 text-green-600" /> WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    if (!resultOpen || !user) return;
                    const subject = `Hasil Ujian - ${resultOpen.title} - ${user.name}`;
                    const body = `Berikut adalah hasil ujian:\n\nNama: ${user.name}\nEmail: ${user.email}\nUjian: ${resultOpen.title}\nTanggal: ${resultOpen.date}\nNilai: ${resultOpen.score}\n\nTerima kasih.`;
                    openEmailShare(user.email, subject, body);
                  }}>
                    <Mail className="mr-2 h-4 w-4 text-blue-600" /> Email Saya
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TopBar({ onLogout, user }: { onLogout: () => void, user: any }) {
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
              <div className="text-sm font-medium">{user?.name || "Mahasiswa"}</div>
              <div className="text-xs text-muted-foreground">{user?.email || ""}</div>
            </div>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-brand-soft text-brand">
              {user?.name?.substring(0, 2).toUpperCase() || "MH"}
            </AvatarFallback>
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

