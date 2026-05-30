import { Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimerDisplayProps {
  timeDisplay?: string;
}

export function TimerDisplay({ timeDisplay = "01:39:45" }: TimerDisplayProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="rounded-md border bg-muted px-3 py-1.5 font-mono text-sm font-semibold tabular-nums">
          <Clock className="mr-1 inline h-3.5 w-3.5 -translate-y-0.5" />
          {timeDisplay}
        </div>
      </TooltipTrigger>
      <TooltipContent>Sisa waktu ujian</TooltipContent>
    </Tooltip>
  );
}
