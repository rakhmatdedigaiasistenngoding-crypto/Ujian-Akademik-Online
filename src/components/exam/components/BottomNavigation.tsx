import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BottomNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function BottomNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
}: BottomNavigationProps) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            className="h-12"
            disabled={currentQuestion === 0}
            onClick={onPrevious}
          >
            <ChevronLeft className="!h-4 !w-4" />
            Sebelumnya
          </Button>
        </TooltipTrigger>
        <TooltipContent>Kembali ke soal sebelumnya</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            className="h-12"
            disabled={currentQuestion === totalQuestions - 1}
            onClick={onNext}
          >
            Selanjutnya
            <ChevronRight className="!h-4 !w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Lanjut ke soal berikutnya</TooltipContent>
      </Tooltip>
    </div>
  );
}
