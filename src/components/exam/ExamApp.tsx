import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoginView } from "./LoginView";
import { StudentDashboard } from "./StudentDashboard";
import { ExamView } from "./ExamView";
import { LecturerDashboard } from "./LecturerDashboard";
import { ResultView } from "./ResultView";
import { useAuthStore } from "@/stores/authStore";
import { useExamStore } from "@/stores/examStore";
import { ExamConfig } from "@/types/exam";
import React from "react";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-500 bg-red-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Aplikasi Crash!</h1>
          <p className="font-bold">{this.state.error?.message}</p>
          <pre className="mt-4 p-4 bg-white border border-red-200 rounded text-xs overflow-auto">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ExamApp() {
  const { isAuthenticated, user, signOut, hasHydrated, initializeAuth } = useAuthStore();
  const { session, startExam, resetExam } = useExamStore();

  // Initialize Supabase Auth on mount
  useEffect(() => {
    // Memaksa reset status loading yang mungkin nyangkut di IndexedDB
    useExamStore.setState({ isLoading: false, error: null });
    initializeAuth();
  }, [initializeAuth]);

  const handleLogout = async () => {
    await signOut();
    resetExam();
  };

  const handleStartExam = (config: ExamConfig) => {
    if (!user) return;
    
    // Start exam with real data from Supabase
    startExam(
      config,
      user.id,
      user.deviceId || 'unknown-device'
    );
  };

  // Determine which page to show based on store state
  const renderPage = () => {
    // Wait until persisted auth state has been restored
    // This prevents a brief login-screen flash during browser refresh
    if (!hasHydrated) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Memuat sesi...
        </div>
      );
    }

    // Not authenticated -> show login
    if (!isAuthenticated || !user) {
      return <LoginView />;
    }

    // Lecturer -> show lecturer dashboard
    if (user.role === "lecturer") {
      return <LecturerDashboard onLogout={handleLogout} />;
    }

    // Student with active exam session -> show exam view
    if (session?.status === "active") {
      return <ExamView />;
    }

    // Student with submitted exam session -> show result summary
    if (session?.status === "submitted") {
      return <ResultView onBackToDashboard={resetExam} />;
    }

    // Student without active exam -> show dashboard
    return (
      <StudentDashboard
        onStart={handleStartExam}
        onLogout={handleLogout}
      />
    );
  };

  return (
    <ErrorBoundary>
      <TooltipProvider delayDuration={200}>
        <div className="min-h-screen bg-background text-foreground">
          {renderPage()}
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
