import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Upload, Loader2, FileDown, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

type Student = {
  id: string;
  npm: string;
  name: string;
  email: string;
};

interface ClassStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
}

export function ClassStudentModal({ isOpen, onClose, classId, className }: ClassStudentModalProps) {
  const { user } = useAuthStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form input manual
  const [formData, setFormData] = useState({
    npm: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    if (isOpen && classId) {
      fetchStudents();
    }
  }, [isOpen, classId]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_students')
        .select('*')
        .eq('class_id', classId)
        .order('npm', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      alert("Gagal memuat daftar mahasiswa: " + (error?.message || JSON.stringify(error)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingStudent) {
        const { error } = await supabase
          .from('class_students')
          .update({
            npm: formData.npm,
            name: formData.name,
            email: formData.email
          })
          .eq('id', editingStudent.id);

        if (error) {
          if (error.code === '23505') throw new Error("Email ini sudah terdaftar di kelas ini.");
          throw error;
        }
        
        setEditingStudent(null);
      } else {
        const { error } = await supabase
          .from('class_students')
          .insert([{
            class_id: classId,
            npm: formData.npm,
            name: formData.name,
            email: formData.email
          }]);

        if (error) {
          if (error.code === '23505') throw new Error("Email ini sudah terdaftar di kelas ini.");
          throw error;
        }
      }

      setFormData({ npm: "", name: "", email: "" });
      fetchStudents();
    } catch (error: any) {
      console.error("Error adding student:", error);
      alert("Gagal menambahkan mahasiswa: " + (error?.message || JSON.stringify(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      npm: student.npm,
      name: student.name,
      email: student.email
    });
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setFormData({ npm: "", name: "", email: "" });
  };

  const handleDelete = async (id: string) => {
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }
    if (!confirm("Hapus mahasiswa ini dari kelas?")) return;
    
    try {
      const { error } = await supabase.from('class_students').delete().eq('id', id);
      if (error) throw error;
      fetchStudents();
    } catch (error: any) {
      alert("Gagal menghapus mahasiswa: " + error.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsSubmitting(true);
    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
      
      // Skip header if exists
      const hasHeader = rows[0].toLowerCase().includes('npm') || rows[0].toLowerCase().includes('nama');
      const dataRows = hasHeader ? rows.slice(1) : rows;

      // Auto-detect delimiter: titik koma (;) atau koma (,)
      const delimiter = rows[0].includes(';') ? ';' : ',';

      const newStudents = dataRows.map(row => {
        const cols = row.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
        const npm = cols[0] || "";
        const email = cols[2] || `${npm}@tanpa-email.com`; // Beri dummy email jika kosong
        
        return {
          class_id: classId,
          npm: npm,
          name: cols[1] || "",
          email: email
        };
      }).filter(s => s.npm && s.name);

      if (newStudents.length === 0) {
        throw new Error("Format CSV tidak valid. Pastikan formatnya: NPM,Nama,Email");
      }

      // Gunakan insert biasa, jika ada email duplikat biarkan error muncul
      const { error } = await supabase
        .from('class_students')
        .insert(newStudents);

      if (error) {
        if (error.code === '23505') {
          throw new Error("Sebagian email di dalam CSV sudah ada di kelas ini (Duplikat).");
        }
        throw error;
      }
      
      alert(`Berhasil mengunggah ${newStudents.length} mahasiswa!`);
      fetchStudents();
    } catch (error: any) {
      console.error("CSV Upload Error:", error);
      alert("Gagal memproses file CSV: " + (error?.message || JSON.stringify(error)));
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = "NPM,Nama,Email\n220110001,Andi Pratama,andi@student.ac.id\n220110002,Budi Santoso,budi@student.ac.id";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_mahasiswa.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Kelola Mahasiswa - {className}</DialogTitle>
          <DialogDescription>
            Tambahkan mahasiswa secara manual atau upload file CSV (NPM, Nama, Email) sekaligus.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4 space-y-6 px-1">
          {/* Bagian Input & Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Manual */}
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold">{editingStudent ? "Edit Mahasiswa" : "Tambah Manual"}</h3>
                {editingStudent && (
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-6 px-2 text-xs text-muted-foreground">
                    <X className="h-3 w-3 mr-1" /> Batal
                  </Button>
                )}
              </div>
              <form onSubmit={handleAddManual} className="space-y-3">
                <div>
                  <Label className="text-xs">NPM</Label>
                  <Input size={1} required placeholder="Contoh: 220110001" value={formData.npm} onChange={e => setFormData({...formData, npm: e.target.value})} />
                </div>
                <div>
                  <Label className="text-xs">Nama Lengkap</Label>
                  <Input size={1} required placeholder="Contoh: Andi Pratama" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input size={1} type="email" required placeholder="Contoh: andi@student.ac.id" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <Button type="submit" className="w-full" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingStudent ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />)}
                  {editingStudent ? "Simpan Perubahan" : "Tambahkan Mahasiswa"}
                </Button>
              </form>
            </div>

            {/* Form Upload */}
            <div className="rounded-lg border p-4 flex flex-col justify-between bg-muted/20">
              <div>
                <h3 className="text-sm font-semibold mb-2">Upload Batch (CSV)</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Pastikan file berekstensi .csv dengan urutan kolom persis: <strong>NPM, Nama, Email</strong> tanpa tanda kutip berlebih.
                </p>
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="mb-6 w-full bg-background">
                  <FileDown className="mr-2 h-4 w-4 text-brand" />
                  Download Template CSV
                </Button>
              </div>
              
              <div>
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload} 
                  disabled={isSubmitting}
                  className="cursor-pointer bg-background" 
                />
                <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                  Memilih file akan langsung memulai proses upload.
                </p>
              </div>
            </div>
          </div>

          {/* Tabel Mahasiswa */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Daftar Mahasiswa ({students.length})</h3>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[100px]">NPM</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right w-[80px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        Belum ada mahasiswa di kelas ini.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono text-xs">{student.npm}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-muted-foreground">{student.email}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:bg-primary/10 mr-1" 
                            onClick={() => handleEditClick(student)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
