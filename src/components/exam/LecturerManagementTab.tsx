import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package, Search, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { ExamConfig } from "@/types/exam";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/stores/authStore";

type ExamWithPackages = ExamConfig & {
  packageCount: number;
  generationVersion: number;
};

export function LecturerManagementTab() {
  const { user } = useAuthStore();
  const [exams, setExams] = useState<ExamWithPackages[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamWithPackages | null>(null);
  
  const [deleteCount, setDeleteCount] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    matakuliah: "Pemrograman Berorientasi Objek",
    duration: 60,
    maxRetakes: 1,
    availableFrom: "",
    availableUntil: "",
    distEasy: 10,
    distMedium: 10,
    distHard: 10,
  });
  
  // Generate states
  const [generateCount, setGenerateCount] = useState(50);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      setFormData({
        id: selectedExam.id,
        title: selectedExam.title,
        matakuliah: selectedExam.matakuliah || "Pemrograman Berorientasi Objek",
        duration: selectedExam.duration,
        maxRetakes: selectedExam.maxRetakes || 1,
        availableFrom: selectedExam.availableFrom ? new Date(selectedExam.availableFrom).toISOString().slice(0, 16) : "",
        availableUntil: selectedExam.availableUntil ? new Date(selectedExam.availableUntil).toISOString().slice(0, 16) : "",
        distEasy: selectedExam.distribution?.easy || 0,
        distMedium: selectedExam.distribution?.medium || 0,
        distHard: selectedExam.distribution?.hard || 0,
      });
      fetchTopicsForExam(selectedExam.matakuliah);
    } else {
      setFormData({
        id: "",
        title: "",
        matakuliah: "Pemrograman Berorientasi Objek",
        duration: 60,
        maxRetakes: 1,
        availableFrom: "",
        availableUntil: "",
        distEasy: 10,
        distMedium: 10,
        distHard: 10,
      });
      setAvailableTopics([]);
      setSelectedTopics([]);
    }
  }, [selectedExam, isExamModalOpen, isGenerateModalOpen]);

  const fetchTopicsForExam = async (matakuliah: string) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('topic')
        .eq('matakuliah', matakuliah);
      
      if (error) throw error;
      
      const topics = Array.from(new Set(data.map(q => q.topic).filter(Boolean)));
      setAvailableTopics(topics);
      setSelectedTopics(topics); // default select all
    } catch (err) {
      console.error("Gagal memuat topik:", err);
    }
  };

  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const { data: configs, error: configError } = await supabase
        .from("exam_configs")
        .select("*")
        .order("title");

      if (configError) throw configError;

      const { data: packages, error: pkgError } = await supabase
        .from("exam_packages")
        .select("exam_id, generation_version");

      if (pkgError) throw pkgError;

      const examsWithCount = (configs || []).map((config) => {
        const examPackages = (packages || []).filter((p) => p.exam_id === config.id);
        const latestVersion = examPackages.length > 0 
          ? Math.max(...examPackages.map(p => p.generation_version || 1)) 
          : 0;

        return {
          id: config.id,
          title: config.title,
          matakuliah: config.matakuliah,
          duration: config.duration,
          totalQuestions: config.total_questions,
          distribution: config.distribution,
          scoreRelease: config.score_release,
          maxRetakes: config.max_retakes,
          availableFrom: config.available_from,
          availableUntil: config.available_until,
          packageCount: examPackages.length,
          generationVersion: latestVersion,
        } as ExamWithPackages;
      });

      setExams(examsWithCount);
    } catch (error) {
      console.error("Error fetching exams:", error);
      alert("Gagal mengambil data ujian dari server.");
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
        id: selectedExam ? selectedExam.id : crypto.randomUUID(),
        title: formData.title,
        matakuliah: formData.matakuliah,
        duration: formData.duration,
        total_questions: formData.distEasy + formData.distMedium + formData.distHard,
        distribution: { easy: formData.distEasy, medium: formData.distMedium, hard: formData.distHard },
        score_release: 'immediate',
        max_retakes: formData.maxRetakes,
        available_from: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : null,
        available_until: formData.availableUntil ? new Date(formData.availableUntil).toISOString() : null,
      };

      const { error } = await supabase.from('exam_configs').upsert(payload);
      if (error) throw error;
      
      setIsExamModalOpen(false);
      fetchExams();
    } catch (err: any) {
      alert("Gagal menyimpan ujian: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }
    if (!confirm("Yakin ingin menghapus ujian ini? Semua data sesi, nilai, dan paket ujian terkait akan terhapus.")) return;
    
    try {
      const { error } = await supabase.from('exam_configs').delete().eq('id', id);
      if (error) throw error;
      fetchExams();
    } catch (err: any) {
      alert("Gagal menghapus ujian: " + err.message);
    }
  };

  const handleDeletePackages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data: packagesToDelete, error: fetchError } = await supabase
        .from('exam_packages')
        .select('id')
        .eq('exam_id', selectedExam.id)
        .limit(deleteCount);

      if (fetchError) throw fetchError;
      
      if (!packagesToDelete || packagesToDelete.length === 0) {
        setIsDeleteModalOpen(false);
        return;
      }

      const idsToDelete = packagesToDelete.map(p => p.id);

      const { error } = await supabase
        .from('exam_packages')
        .delete()
        .in('id', idsToDelete);
        
      if (error) throw error;
      
      setIsDeleteModalOpen(false);
      fetchExams();
    } catch (error: any) {
      alert("Gagal menghapus paket soal: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePackages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;
    
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Validasi Ketersediaan Soal di Sisi Klien terlebih dahulu
      let query = supabase
        .from('questions')
        .select('id, level', { count: 'exact' })
        .eq('matakuliah', selectedExam.matakuliah);
        
      if (selectedTopics.length > 0) {
        query = query.in('topic', selectedTopics);
      }
      
      const { data: availableQs, error: countError } = await query;
      if (countError) throw countError;
      
      const easyAvailable = availableQs.filter(q => q.level === 'easy').length;
      const mediumAvailable = availableQs.filter(q => q.level === 'medium').length;
      const hardAvailable = availableQs.filter(q => q.level === 'hard').length;
      
      const dist = selectedExam.distribution as any;
      const easyRequired = parseInt(dist?.easy || 0);
      const mediumRequired = parseInt(dist?.medium || 0);
      const hardRequired = parseInt(dist?.hard || 0);
      
      if (easyAvailable < easyRequired || mediumAvailable < mediumRequired || hardAvailable < hardRequired) {
        const errorMsg = `Soal di Bank Soal tidak cukup untuk ujian ini!
Dibutuhkan vs Tersedia:
- Mudah: ${easyRequired} dibutuhkan, ${easyAvailable} tersedia
- Sedang: ${mediumRequired} dibutuhkan, ${mediumAvailable} tersedia
- Sulit: ${hardRequired} dibutuhkan, ${hardAvailable} tersedia

Harap tambahkan soal ke Bank Soal atau pilih topik yang mencakup lebih banyak soal.`;
        alert(errorMsg);
        setIsSubmitting(false);
        return;
      }

      // Memanggil RPC untuk mengenerate soal yang lebih efisien dan terpusat di sisi server
      const { error: rpcError } = await supabase.rpc('generate_exam_packages', {
        p_exam_id: selectedExam.id,
        p_num_packages: generateCount,
        p_version: selectedExam.generationVersion + 1,
        p_topics: selectedTopics.length > 0 ? selectedTopics : null
      });

      if (rpcError) throw rpcError;

      setIsGenerateModalOpen(false);
      fetchExams();
    } catch (err: any) {
      alert("Gagal meng-generate paket: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Manajemen Ujian</h2>
        <Button onClick={() => { setSelectedExam(null); setIsExamModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Buat Ujian Baru
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mata Kuliah / Ujian</TableHead>
                <TableHead>Durasi / Soal</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Paket Soal</TableHead>
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
              ) : exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Belum ada ujian yang dibuat.
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">
                      <div className="text-xs text-brand font-semibold mb-1">{exam.matakuliah || "Umum"}</div>
                      {exam.title}
                      <div className="text-xs text-muted-foreground mt-1">
                        Percobaan: {exam.maxRetakes}x
                      </div>
                    </TableCell>
                    <TableCell>
                      {exam.duration} Menit
                      <div className="text-xs text-muted-foreground mt-1">
                        {exam.totalQuestions} Soal
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {exam.availableFrom ? new Date(exam.availableFrom).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'Sekarang'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        s/d {exam.availableUntil ? new Date(exam.availableUntil).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'Selamanya'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {exam.packageCount > 0 ? (
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            {exam.packageCount} Paket Tersedia
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            Versi {exam.generationVersion}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                          Kosong
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedExam(exam);
                            setIsGenerateModalOpen(true);
                          }}
                        >
                          <Package className="mr-1.5 h-3.5 w-3.5" />
                          Generate
                        </Button>
                        
                        {exam.packageCount > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10 border-destructive/20"
                                onClick={() => {
                                  setSelectedExam(exam);
                                  setDeleteCount(exam.packageCount);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Hapus Paket
                            </TooltipContent>
                          </Tooltip>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedExam(exam);
                            setIsExamModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(exam.id)}>
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

      {/* Modal Form Ujian */}
      <Dialog open={isExamModalOpen} onOpenChange={setIsExamModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedExam ? "Edit Pengaturan Ujian" : "Buat Ujian Baru"}</DialogTitle>
            <DialogDescription>
              Atur detail ujian, mata kuliah, dan jumlah distribusi soal di sini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateOrUpdate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Mata Kuliah</Label>
              <Input required value={formData.matakuliah} onChange={e => setFormData({...formData, matakuliah: e.target.value})} placeholder="Contoh: Pemrograman Berorientasi Objek" />
            </div>
            <div className="space-y-2">
              <Label>Nama / Judul Ujian</Label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Contoh: UTS Genap" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Durasi (Menit)</Label>
                <Input type="number" required min="1" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <Label>Maksimal Percobaan</Label>
                <Input type="number" required min="1" value={formData.maxRetakes} onChange={e => setFormData({...formData, maxRetakes: parseInt(e.target.value) || 1})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Waktu Mulai</Label>
                <Input type="datetime-local" value={formData.availableFrom} onChange={e => setFormData({...formData, availableFrom: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Batas Akhir</Label>
                <Input type="datetime-local" value={formData.availableUntil} onChange={e => setFormData({...formData, availableUntil: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2 border p-3 rounded-md bg-muted/20">
              <Label className="font-semibold text-brand">Distribusi Soal dari Bank Soal</Label>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Mudah</Label>
                  <Input type="number" min="0" value={formData.distEasy} onChange={e => setFormData({...formData, distEasy: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Sedang</Label>
                  <Input type="number" min="0" value={formData.distMedium} onChange={e => setFormData({...formData, distMedium: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Sulit</Label>
                  <Input type="number" min="0" value={formData.distHard} onChange={e => setFormData({...formData, distHard: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <div className="text-xs text-right text-muted-foreground mt-2">
                Total Soal: <span className="font-bold text-foreground">{formData.distEasy + formData.distMedium + formData.distHard}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsExamModalOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Ujian
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Generate Paket */}
      <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Paket Kombinasi</DialogTitle>
            <DialogDescription>
              Buat variasi urutan dan pilihan soal secara acak dari bank soal untuk <strong>{selectedExam?.matakuliah}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGeneratePackages} className="space-y-4 pt-4">
            <div className="space-y-3">
              <Label>Pilih Topik Ujian</Label>
              <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto space-y-2 bg-muted/20">
                {availableTopics.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center">Tidak ada topik tersedia di bank soal untuk matakuliah ini.</p>
                ) : (
                  availableTopics.map(topic => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`topic-${topic}`} 
                        checked={selectedTopics.includes(topic)}
                        onCheckedChange={() => toggleTopic(topic)}
                      />
                      <label htmlFor={`topic-${topic}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {topic}
                      </label>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Jika tidak ada yang dipilih, maka akan menarik dari semua topik pada matakuliah ini.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Jumlah Paket yang Dibuat</Label>
              <Input type="number" required min="1" max="200" value={generateCount} onChange={e => setGenerateCount(parseInt(e.target.value) || 1)} />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsGenerateModalOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting || availableTopics.length === 0}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
                Mulai Generate
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Paket */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Paket Soal</DialogTitle>
            <DialogDescription>
              Tentukan jumlah paket yang ingin dihapus dari total <strong className="text-foreground">{selectedExam?.packageCount} paket</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeletePackages} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Jumlah yang dihapus</Label>
              <Input type="number" required min="1" max={selectedExam?.packageCount || 1} value={deleteCount} onChange={e => setDeleteCount(parseInt(e.target.value) || 1)} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Hapus
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
