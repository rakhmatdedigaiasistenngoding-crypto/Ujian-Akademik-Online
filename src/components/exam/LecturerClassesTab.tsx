import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, Loader2, Link as LinkIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassStudentModal } from "./ClassStudentModal";
import { ClassExamModal } from "./ClassExamModal";
import { ExamConfig } from "@/types/exam";

type ClassData = {
  id: string;
  name: string;
  schedule: string;
  studentCount?: number;
  examCount?: number;
};

export function LecturerClassesTab() {
  const { user } = useAuthStore();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [exams, setExams] = useState<ExamConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    schedule: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch exams for the dropdown
      const { data: examsData, error: examsError } = await supabase
        .from('exam_configs')
        .select('id, title')
        .order('title');
      
      if (examsError) throw examsError;
      setExams(examsData || []);

      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, schedule')
        .order('created_at', { ascending: false });

      if (classesError) throw classesError;

      // Fetch student counts for each class
      const { data: countsData, error: countsError } = await supabase
        .from('class_students')
        .select('class_id');
      
      if (countsError) throw countsError;

      // Fetch exam class links for counts
      const { data: examLinksData, error: examLinksError } = await supabase
        .from('exam_classes')
        .select('class_id');
        
      if (examLinksError) throw examLinksError;

      const classesWithCounts = (classesData || []).map(cls => {
        const count = countsData?.filter(c => c.class_id === cls.id).length || 0;
        const examCount = examLinksData?.filter(e => e.class_id === cls.id).length || 0;
        return { ...cls, studentCount: count, examCount };
      });

      setClasses(classesWithCounts);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal mengambil data dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        schedule: formData.schedule,
      };

      if (formData.id) {
        const { error } = await supabase
          .from('classes')
          .update(payload)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('classes')
          .insert([payload]);
        if (error) throw error;
      }

      setIsClassModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert("Gagal menyimpan kelas: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }
    if (!confirm("Hapus kelas ini? Semua data mahasiswa di dalamnya juga akan terhapus.")) return;
    
    try {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      alert("Gagal menghapus kelas: " + error.message);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Daftar Kelas</h2>
          <p className="text-sm text-muted-foreground">
            Kelola kelas, pasangkan dengan ujian, dan atur daftar pesertanya.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari kelas..."
              className="w-full sm:w-64 pl-8 bg-background"
            />
          </div>
          <Button onClick={() => {
            setFormData({ id: "", name: "", schedule: "" });
            setIsClassModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Kelas
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Jadwal Pertemuan</TableHead>
                <TableHead>Ujian Terpasang</TableHead>
                <TableHead className="text-center">Peserta</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Belum ada kelas yang dibuat.
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{cls.schedule || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <LinkIcon className="h-3 w-3" />
                        <span className="text-sm font-medium">{cls.examCount || 0} Ujian</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                        <Users className="mr-1 h-3 w-3" />
                        {cls.studentCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedClass(cls);
                            setIsExamModalOpen(true);
                          }}
                        >
                          <LinkIcon className="mr-1.5 h-3.5 w-3.5" />
                          Kelola Ujian
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedClass(cls);
                            setIsStudentModalOpen(true);
                          }}
                        >
                          <Users className="mr-1.5 h-3.5 w-3.5" />
                          Kelola Peserta
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setFormData({
                              id: cls.id,
                              name: cls.name,
                              schedule: cls.schedule || ""
                            });
                            setIsClassModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(cls.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Form Kelas */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Kelas" : "Buat Kelas Baru"}</DialogTitle>
            <DialogDescription>
              Tentukan nama kelas dan jadwal pertemuannya.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateOrUpdate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nama Kelas</Label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: TIF-3A" />
            </div>
            <div className="space-y-2">
              <Label>Jadwal (Opsional)</Label>
              <Input value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} placeholder="Contoh: Senin, 08:00 - 09:40" />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsClassModalOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Kelas
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Kelola Mahasiswa */}
      {selectedClass && (
        <ClassStudentModal
          isOpen={isStudentModalOpen}
          onClose={() => {
            setIsStudentModalOpen(false);
            fetchData(); // Refresh counts when closing
          }}
          classId={selectedClass.id}
          className={selectedClass.name}
        />
      )}

      {/* Modal Kelola Ujian */}
      {selectedClass && (
        <ClassExamModal
          isOpen={isExamModalOpen}
          onClose={() => {
            setIsExamModalOpen(false);
            fetchData(); // Refresh counts when closing
          }}
          classId={selectedClass.id}
          className={selectedClass.name}
          availableExams={exams}
        />
      )}
    </div>
  );
}
