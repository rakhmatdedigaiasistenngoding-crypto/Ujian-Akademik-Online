import { Award, CheckCircle2, Clock, FileText, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExamStore } from "@/stores/examStore";

interface ResultViewProps {
  onBackToDashboard: () => void;
}

export function ResultView({ onBackToDashboard }: ResultViewProps) {
  const { session, scoreResult } = useExamStore();

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tidak ada hasil ujian yang tersedia.</p>
            <Button className="mt-4" onClick={onBackToDashboard}>
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const answeredCount = session.answers.filter(Boolean).length;
  const totalQuestions = session.questions.length;
  const finalScore = scoreResult?.finalScore ?? session.score ?? 0;
  const maxRawScore = scoreResult?.maxRawScore ?? session.questions.reduce((total, q) => total + q.weight, 0);
  const submittedAt = session.finishedAt
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(session.finishedAt))
    : "-";

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--brand)/0.16),transparent_34%),radial-gradient(circle_at_bottom_right,hsl(var(--success)/0.14),transparent_36%)]" />

      <section className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <Badge className="mb-3 border-success/30 bg-success/10 text-success hover:bg-success/10">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Ujian Berhasil Disubmit
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ringkasan Hasil Ujian
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Berikut hasil sementara dari sesi ujian Anda.
          </p>
        </div>

        <Card className="overflow-hidden border-brand/20 bg-card/90 shadow-xl shadow-brand/5 backdrop-blur">
          <CardHeader className="border-b bg-muted/30 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <Trophy className="h-8 w-8" />
            </div>
            <CardTitle className="text-lg">{session.examId}</CardTitle>
            <p className="text-xs text-muted-foreground">Disubmit pada {submittedAt}</p>
          </CardHeader>
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="rounded-2xl border bg-gradient-to-br from-brand-soft to-background p-6 text-center">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Nilai Akhir
              </div>
              <div className="mt-2 text-6xl font-black tracking-tight text-brand">
                {Math.round(finalScore)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Skor dummy frontend sebelum grading backend Supabase
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryTile
                icon={<FileText className="h-4 w-4" />}
                label="Soal Dijawab"
                value={`${answeredCount}/${totalQuestions}`}
              />
              <SummaryTile
                icon={<Award className="h-4 w-4" />}
                label="Bobot Maksimum"
                value={String(maxRawScore)}
              />
              <SummaryTile
                icon={<Clock className="h-4 w-4" />}
                label="Status"
                value="Selesai"
              />
            </div>

            {scoreResult && (
              <div className="rounded-xl border bg-muted/20 p-4">
                <h2 className="mb-3 text-sm font-semibold">Breakdown Level Soal</h2>
                <div className="grid gap-2 text-sm">
                  {Object.entries(scoreResult.breakdown).map(([level, item]) => (
                    <div key={level} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                      <span className="capitalize text-muted-foreground">{level}</span>
                      <span className="font-medium">{item.correct}/{item.total} benar</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button size="lg" className="w-full" onClick={onBackToDashboard}>
              <RotateCcw className="h-4 w-4" />
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-lg font-bold">{value}</div>
    </div>
  );
}
