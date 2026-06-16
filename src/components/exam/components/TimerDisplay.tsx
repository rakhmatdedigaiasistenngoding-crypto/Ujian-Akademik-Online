import { Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  timeRemaining?: number; // in seconds
}

/**
 * Format seconds to HH:MM:SS
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [hours, minutes, secs]
    .map(val => String(val).padStart(2, '0'))
    .join(':');
}

export function TimerDisplay({ timeRemaining = 0 }: TimerDisplayProps) {
  const isLowTime = timeRemaining < 300; // Less than 5 minutes
  const isCritical = timeRemaining < 60; // Less than 1 minute
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "rounded-md border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums",
          isCritical 
            ? "border-destructive bg-destructive/10 text-destructive animate-pulse" 
            : isLowTime 
            ? "border-warning bg-warning/10 text-warning"
            : "border-muted bg-muted"
        )}>
          <Clock className="mr-1 inline h-3.5 w-3.5 -translate-y-0.5" />
          {formatTime(timeRemaining)}
        </div>
      </TooltipTrigger>
      <TooltipContent>Sisa waktu ujian</TooltipContent>
    </Tooltip>
  );
}
