import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Option {
  key: string;
  text: string;
}

interface QuestionAreaProps {
  questionNumber: number;
  totalQuestions: number;
  answeredCount: number;
  questionText: string;
  options: Option[];
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
}

export function QuestionArea({
  questionNumber,
  totalQuestions,
  answeredCount,
  questionText,
  options,
  selectedAnswer,
  onAnswerSelect,
}: QuestionAreaProps) {
  return (
    <section className="lg:col-span-7">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Soal {questionNumber} dari {totalQuestions}
        </span>
        <span className="text-xs text-muted-foreground">
          Terjawab: {answeredCount}/{totalQuestions}
        </span>
      </div>

      <Card>
        <CardContent className="space-y-5 p-5 sm:p-6">
          <p className="text-base leading-relaxed">{questionText}</p>

          <div className="space-y-2.5">
            {options.map((opt) => {
              const selected = selectedAnswer === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => onAnswerSelect(opt.key)}
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
    </section>
  );
}
