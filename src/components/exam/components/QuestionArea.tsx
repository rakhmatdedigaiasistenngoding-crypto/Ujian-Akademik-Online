import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Option {
  key: string;
  text: string;
}

interface QuestionAreaProps {
  questionNumber: number;
  totalQuestions: number;
  answeredCount: number;
  questionText: string;
  options: Option[];
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  image_url?: string;
  video_url?: string;
  link_url?: string;
}

export function QuestionArea({
  questionNumber,
  totalQuestions,
  answeredCount,
  questionText,
  options,
  selectedAnswer,
  onAnswerSelect,
  image_url,
  video_url,
  link_url,
}: QuestionAreaProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Soal {questionNumber} dari {totalQuestions}
        </span>
        <span className="text-xs text-muted-foreground">
          Terjawab: {answeredCount}/{totalQuestions}
        </span>
      </div>

      <Card>
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="text-base leading-relaxed whitespace-pre-wrap">{questionText}</div>
          
          {(image_url || video_url || link_url) && (
            <div className="space-y-4 my-4 p-4 border rounded-lg bg-muted/10">
              {image_url && (
                <div className="flex justify-center">
                  <img src={image_url} alt="Ilustrasi Soal" className="max-h-[300px] rounded-md object-contain border shadow-sm" />
                </div>
              )}
              {video_url && (
                <div className="flex justify-center w-full aspect-video">
                  {video_url.includes("youtube.com") || video_url.includes("youtu.be") ? (
                    <iframe 
                      src={video_url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")} 
                      className="w-full max-w-2xl h-full rounded-md shadow-sm"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen 
                    />
                  ) : (
                    <video controls src={video_url} className="w-full max-w-2xl h-full rounded-md shadow-sm bg-black" />
                  )}
                </div>
              )}
              {link_url && (
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md border text-sm">
                  <span className="font-semibold">Referensi Tautan:</span>
                  <a href={link_url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline break-all">
                    {link_url}
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2.5">
            {options.map((opt) => {
              const selected = selectedAnswer === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => onAnswerSelect(opt.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left text-sm transition-colors",
                    "hover:bg-muted/50",
                    selected ? "border-brand bg-brand-soft" : "border-border bg-card",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                      selected
                        ? "border-brand bg-transparent"
                        : "border-muted-foreground/30 bg-transparent",
                    )}
                  >
                    {selected && (
                      <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                    )}
                  </span>
                  <span className="font-medium">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
