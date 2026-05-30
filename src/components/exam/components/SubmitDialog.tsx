import { Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface SubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answeredCount: number;
  unansweredCount: number;
  onSubmit: () => void;
}

export function SubmitDialog({
  open,
  onOpenChange,
  answeredCount,
  unansweredCount,
  onSubmit,
}: SubmitDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-brand" />
            Kirim jawaban sekarang?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Pastikan semua jawaban sudah benar. Setelah dikirim, Anda
                tidak dapat mengubahnya kembali.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border bg-success/10 p-3 text-center">
                  <div className="text-xs text-success">Terjawab</div>
                  <div className="text-lg font-bold text-success">
                    {answeredCount}
                  </div>
                </div>
                <div
                  className={cn(
                    "rounded-md border p-3 text-center",
                    unansweredCount > 0
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
                      : "bg-muted",
                  )}
                >
                  <div className="text-xs">Belum dijawab</div>
                  <div className="text-lg font-bold">{unansweredCount}</div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Periksa lagi</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>
            <Send className="!h-3.5 !w-3.5" />
            Kirim & Selesai
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
