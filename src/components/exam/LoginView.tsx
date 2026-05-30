import { GraduationCap, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Role = "student" | "lecturer";

interface LoginViewProps {
  onLogin: (role: Role) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft">
          <GraduationCap className="h-8 w-8 text-brand" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Sistem Ujian Berbasis Online
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Masuk untuk mengakses jadwal & sesi ujian Anda.
        </p>

        <div className="mt-10 space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                onClick={() => onLogin("student")}
                className="h-14 w-full text-base font-medium"
              >
                <Mail className="!h-5 !w-5" />
                Masuk dengan Google Classroom
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Sistem mendeteksi peran dari akun Google Anda secara otomatis.
            </TooltipContent>
          </Tooltip>

          <Button
            size="lg"
            variant="outline"
            onClick={() => onLogin("lecturer")}
            className="h-12 w-full text-sm"
          >
            Demo: Masuk sebagai Dosen
          </Button>

          <p className="mt-4 text-xs text-muted-foreground">
            Akun mahasiswa otomatis masuk ke panel ujian; akun dosen langsung ke
            panel pemantauan.
          </p>
        </div>
      </div>
    </main>
  );
}
