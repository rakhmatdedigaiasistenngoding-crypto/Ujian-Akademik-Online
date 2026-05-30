import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GridMap } from "./GridMap";
import { Legend } from "./Legend";

interface QuestionMapSidebarProps {
  answers: (string | null)[];
  currentQuestion: number;
  onQuestionSelect: (index: number) => void;
}

export function QuestionMapSidebar({
  answers,
  currentQuestion,
  onQuestionSelect,
}: QuestionMapSidebarProps) {
  return (
    <aside className="hidden lg:col-span-3 lg:block">
      <div className="sticky top-24">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Peta Soal</CardTitle>
          </CardHeader>
          <CardContent>
            <GridMap
              answers={answers}
              currentQuestion={currentQuestion}
              onQuestionSelect={onQuestionSelect}
            />
            <Legend />
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
