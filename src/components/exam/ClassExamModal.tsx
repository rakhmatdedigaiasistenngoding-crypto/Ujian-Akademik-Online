import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { ExamConfig } from "@/types/exam";

interface ClassExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  availableExams: ExamConfig[];
}

export function ClassExamModal({ isOpen, onClose, classId, className, availableExams }: ClassExamModalProps) {
  const { user } = useAuthStore();
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>([]);
  const [initialExamIds, setInitialExamIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && classId) {
      fetchLinkedExams();
    }
  }, [isOpen, classId]);

  const fetchLinkedExams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('exam_classes')
        .select('exam_id')
        .eq('class_id', classId);

      if (error) throw error;
      
      const ids = data.map(d => d.exam_id);
      setSelectedExamIds(ids);
      setInitialExamIds(ids);
    } catch (error: any) {
      alert("Gagal memuat daftar ujian yang terhubung.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (examId: string, checked: boolean) => {
    if (checked) {
      setSelectedExamIds(prev => [...prev, examId]);
    } else {
      setSelectedExamIds(prev => prev.filter(id => id !== examId));
    }
  };

  const handleSave = async () => {
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const toDelete = initialExamIds.filter(id => !selectedExamIds.includes(id));
      const toInsert = selectedExamIds.filter(id => !initialExamIds.includes(id));

      if (toDelete.length > 0) {
        const { error } = await supabase
          .from('exam_classes')
          .delete()
          .eq('class_id', classId)
          .in('exam_id', toDelete);
        if (error) throw error;
      }

      if (toInsert.length > 0) {
        const { error } = await supabase
          .from('exam_classes')
          .insert(toInsert.map(examId => ({
            class_id: classId,
            exam_id: examId
          })));
        if (error) throw error;
      }

      onClose();
    } catch (error: any) {
      alert("Gagal menyimpan perubahan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Kelola Ujian - {className}</DialogTitle>
          <DialogDescription>
            Pilih ujian mana saja yang akan ditugaskan ke kelas ini. Satu kelas dapat mengerjakan banyak ujian.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : availableExams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
              Belum ada ujian yang dibuat. Silakan buat ujian terlebih dahulu di tab Manajemen Ujian.
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto px-1">
              {availableExams.map(exam => (
                <div key={exam.id} className="flex items-center space-x-3 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id={`exam-${exam.id}`} 
                    checked={selectedExamIds.includes(exam.id)}
                    onCheckedChange={(checked) => handleToggle(exam.id, checked as boolean)}
                  />
                  <Label htmlFor={`exam-${exam.id}`} className="flex-1 cursor-pointer font-medium leading-none">
                    {exam.title}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Batal</Button>
          <Button onClick={handleSave} disabled={isLoading || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
