import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface GridMapProps {
  answers: (string | null)[];
  currentQuestion: number;
  onQuestionSelect: (index: number) => void;
}

export function GridMap({
  answers,
  currentQuestion,
  onQuestionSelect,
}: GridMapProps) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-5">
      {answers.map((a, i) => {
        const answered = a !== null;
        const isCurrent = i === currentQuestion;
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onQuestionSelect(i)}
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
