import { useState, useEffect } from "react";
import { ExamHeader } from "./components/ExamHeader";
import { QuestionArea } from "./components/QuestionArea";
import { QuestionMapSidebar } from "./components/QuestionMapSidebar";
import { QuestionMapMobile } from "./components/QuestionMapMobile";
import { BottomNavigation } from "./components/BottomNavigation";
import { SubmitDialog } from "./components/SubmitDialog";
import { useExamStore } from "@/stores/examStore";
import { useAuthStore } from "@/stores/authStore";

export function ExamView() {
  const user = useAuthStore((state) => state.user);
  const {
    session,
    currentQuestionIndex,
    timeRemaining,
    setAnswer,
    setCurrentQuestion,
    tickTime,
    submitExam,
    config,
  } = useExamStore();

  const [mapOpen, setMapOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Store the session status separately to avoid re-creating the timer on every state change
  const sessionStatus = session?.status;

  // Timer effect - ticks every second, only restarts if session status changes
  useEffect(() => {
    if (sessionStatus !== 'active') return;

    const interval = setInterval(() => {
      tickTime();
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus]);

  // If no session, don't render (should not happen with proper routing)
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Tidak ada sesi ujian aktif.</p>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const answered = session.answers.filter(Boolean).length;
  const unanswered = session.questions.length - answered;

  const handleAnswerSelect = (val: string) => {
    setAnswer(currentQuestionIndex, val);
  };

  const goto = (i: number) => {
    setCurrentQuestion(i);
    setMapOpen(false);
  };

  const handleSubmit = () => {
    submitExam();
    setConfirmOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ExamHeader
        examTitle={config?.title || "Ujian Akademik"}
        userName={user?.name || "Peserta"}
        timeDisplay={`${Math.floor(timeRemaining / 3600)}:${String(Math.floor((timeRemaining % 3600) / 60)).padStart(2, '0')}:${String(timeRemaining % 60).padStart(2, '0')}`}
        onSubmit={() => setConfirmOpen(true)}
      />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-10">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <QuestionArea
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={session.questions.length}
            answeredCount={answered}
            questionText={currentQuestion?.text || ""}
            options={currentQuestion?.options || []}
            selectedAnswer={session.answers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            image_url={currentQuestion?.image_url}
            video_url={currentQuestion?.video_url}
            link_url={currentQuestion?.link_url}
          />

          <BottomNavigation
            currentQuestion={currentQuestionIndex}
            totalQuestions={session.questions.length}
            onPrevious={() => goto(currentQuestionIndex - 1)}
            onNext={() => goto(currentQuestionIndex + 1)}
          />
        </div>

        <div className="lg:col-span-3">
          <QuestionMapSidebar
            answers={session.answers}
            currentQuestion={currentQuestionIndex}
            onQuestionSelect={goto}
          />
        </div>
      </div>

      <QuestionMapMobile
        answers={session.answers}
        currentQuestion={currentQuestionIndex}
        onQuestionSelect={goto}
        open={mapOpen}
        onOpenChange={setMapOpen}
      />

      <SubmitDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        answeredCount={answered}
        unansweredCount={unanswered}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
