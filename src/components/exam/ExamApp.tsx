import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoginView } from "./LoginView";
import { StudentDashboard } from "./StudentDashboard";
import { ExamView } from "./ExamView";
import { LecturerDashboard } from "./LecturerDashboard";

type Page = "login" | "dashboard" | "exam" | "lecturer";
type Role = "student" | "lecturer";

export default function ExamApp() {
  const [page, setPage] = useState<Page>("login");

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background text-foreground">
        {page === "login" && (
          <LoginView
            onLogin={(role) => setPage(role === "lecturer" ? "lecturer" : "dashboard")}
          />
        )}
        {page === "dashboard" && (
          <StudentDashboard
            onStart={() => setPage("exam")}
            onLogout={() => setPage("login")}
          />
        )}
        {page === "exam" && <ExamView onFinish={() => setPage("dashboard")} />}
        {page === "lecturer" && (
          <LecturerDashboard onLogout={() => setPage("login")} />
        )}
      </div>
    </TooltipProvider>
  );
}
