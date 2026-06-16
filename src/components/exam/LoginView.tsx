import { GraduationCap, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/authStore";
import { MOCK_STUDENT, MOCK_LECTURER } from "@/lib/mockData";

type Role = "student" | "lecturer";

interface LoginViewProps {
  onLogin?: (role: Role) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const { signInWithGoogle, login, isLoading, error } = useAuthStore();

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  // Demo login for testing (will be removed in production)
  const handleDemoLogin = (role: Role) => {
    const user = role === "student" ? MOCK_STUDENT : MOCK_LECTURER;
    login(user);
    onLogin?.(role);
  };

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

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-10 space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="h-14 w-full text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="!h-5 !w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Mail className="!h-5 !w-5" />
                    Masuk dengan Google Classroom
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Gunakan akun email kampus Anda untuk masuk.
            </TooltipContent>
          </Tooltip>

          {/* Demo buttons for testing - remove in production */}
          <div className="pt-4 border-t">
            <p className="mb-3 text-xs text-muted-foreground">
              Mode Demo (untuk testing):
            </p>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDemoLogin("student")}
                disabled={isLoading}
                className="h-10 w-full text-xs"
              >
                Demo: Masuk sebagai Mahasiswa
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDemoLogin("lecturer")}
                disabled={isLoading}
                className="h-10 w-full text-xs"
              >
                Demo: Masuk sebagai Dosen
              </Button>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Akun mahasiswa otomatis masuk ke panel ujian; akun dosen langsung ke
            panel pemantauan.
          </p>
        </div>
      </div>
    </main>
  );
}
