import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExamHeaderProps {
  userName?: string;
  timeDisplay?: string;
  onSubmit?: () => void;
}

export function ExamHeader({
  userName = "Andi Pratama",
  timeDisplay = "01:39:45",
  onSubmit,
}: ExamHeaderProps) {
  return (
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
              {userName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-md border bg-muted px-3 py-1.5 font-mono text-sm font-semibold tabular-nums">
                <Clock className="mr-1 inline h-3.5 w-3.5 -translate-y-0.5" />
                {timeDisplay}
              </div>
            </TooltipTrigger>
            <TooltipContent>Sisa waktu ujian</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                onClick={onSubmit}
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
  );
}
