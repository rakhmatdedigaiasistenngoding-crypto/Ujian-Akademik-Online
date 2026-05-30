import { useState } from "react";
import { ExamHeader } from "./components/ExamHeader";
import { QuestionArea } from "./components/QuestionArea";
import { QuestionMapSidebar } from "./components/QuestionMapSidebar";
import { QuestionMapMobile } from "./components/QuestionMapMobile";
import { BottomNavigation } from "./components/BottomNavigation";
import { SubmitDialog } from "./components/SubmitDialog";

const TOTAL_QUESTIONS = 33;

const QUESTION_TEXT =
  "Diberikan sebuah array berisi N angka acak. Algoritma pengurutan manakah yang memiliki kompleksitas waktu kasus terburuk O(n log n) dan bersifat stabil?";

const OPTIONS = [
  { key: "A", text: "Quick Sort" },
  { key: "B", text: "Merge Sort" },
  { key: "C", text: "Bubble Sort" },
  { key: "D", text: "Selection Sort" },
];

interface ExamViewProps {
  onFinish: () => void;
}

export function ExamView({ onFinish }: ExamViewProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(TOTAL_QUESTIONS).fill(null),
  );
  const [mapOpen, setMapOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const answered = answers.filter(Boolean).length;
  const unanswered = TOTAL_QUESTIONS - answered;

  const setAnswer = (val: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = val;
      return next;
    });
  };

  const goto = (i: number) => {
    setCurrent(Math.max(0, Math.min(TOTAL_QUESTIONS - 1, i)));
    setMapOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ExamHeader
        userName="Andi Pratama"
        timeDisplay="01:39:45"
        onSubmit={() => setConfirmOpen(true)}
      />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-10">
        <QuestionArea
          questionNumber={current + 1}
          totalQuestions={TOTAL_QUESTIONS}
          answeredCount={answered}
          questionText={QUESTION_TEXT}
          options={OPTIONS}
          selectedAnswer={answers[current]}
          onAnswerSelect={setAnswer}
        />

        <BottomNavigation
          currentQuestion={current}
          totalQuestions={TOTAL_QUESTIONS}
          onPrevious={() => goto(current - 1)}
          onNext={() => goto(current + 1)}
        />

        <QuestionMapSidebar
          answers={answers}
          currentQuestion={current}
          onQuestionSelect={goto}
        />
      </div>

      <QuestionMapMobile
        answers={answers}
        currentQuestion={current}
        onQuestionSelect={goto}
        open={mapOpen}
        onOpenChange={setMapOpen}
      />

      <SubmitDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        answeredCount={answered}
        unansweredCount={unanswered}
        onSubmit={onFinish}
      />
    </div>
  );
}
