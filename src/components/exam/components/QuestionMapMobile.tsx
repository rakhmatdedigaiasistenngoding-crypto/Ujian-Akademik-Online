import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GridMap } from "./GridMap";
import { Legend } from "./Legend";

interface QuestionMapMobileProps {
  answers: (string | null)[];
  currentQuestion: number;
  onQuestionSelect: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionMapMobile({
  answers,
  currentQuestion,
  onQuestionSelect,
  open,
  onOpenChange,
}: QuestionMapMobileProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-5 right-5 z-40 h-14 rounded-full shadow-lg lg:hidden"
            >
              <LayoutGrid className="!h-5 !w-5" />
              Peta Soal
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">Lompat ke nomor soal tertentu</TooltipContent>
      </Tooltip>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Peta Soal</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <GridMap
            answers={answers}
            currentQuestion={currentQuestion}
            onQuestionSelect={onQuestionSelect}
          />
          <Legend />
        </div>
        <SheetClose className="sr-only">Tutup</SheetClose>
      </SheetContent>
    </Sheet>
  );
}
