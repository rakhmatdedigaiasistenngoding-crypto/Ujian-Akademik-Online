import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Upload, Download, Edit, Trash2, Image as ImageIcon, Video, Link as LinkIcon, Loader2, Database, BookOpen, Folder } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Question {
  id: string;
  matakuliah: string;
  topic: string;
  level: 'easy' | 'medium' | 'hard';
  weight: number;
  text: string;
  options: string[]; // We will parse JSONB array to string[]
  correct_answer: number;
  image_url?: string | null;
  video_url?: string | null;
  link_url?: string | null;
}

const levelWeight = { easy: 1, medium: 2, hard: 3 };

export function LecturerQuestionsTab() {
  const { user } = useAuthStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMatakuliah, setFilterMatakuliah] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    matakuliah: "Pemrograman Berorientasi Objek",
    topic: "",
    level: "medium",
    weight: 1,
    text: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "0",
    image_url: "",
    video_url: "",
    link_url: "",
  });

  // Media File State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // CSV State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const parsedData = (data || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : [],
      }));
      setQuestions(parsedData);
    } catch (error: any) {
      console.error("Gagal memuat bank soal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setImageFile(null);
    setVideoFile(null);
    setFormData({
      matakuliah: "Pemrograman Berorientasi Objek",
      topic: "",
      level: "medium",
      weight: 1,
      text: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: "0",
      image_url: "",
      video_url: "",
      link_url: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingId(q.id);
    setImageFile(null);
    setVideoFile(null);
    setFormData({
      matakuliah: q.matakuliah || "Pemrograman Berorientasi Objek",
      topic: q.topic || "",
      level: q.level || "medium",
      weight: q.weight || 1,
      text: q.text || "",
      option1: q.options[0] || "",
      option2: q.options[1] || "",
      option3: q.options[2] || "",
      option4: q.options[3] || "",
      correctAnswer: q.correct_answer?.toString() || "0",
      image_url: q.image_url || "",
      video_url: q.video_url || "",
      link_url: q.link_url || "",
    });
    setIsModalOpen(true);
  };

  const uploadMediaToStorage = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('exam_media')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('exam_media')
      .getPublicUrl(fileName);
      
    return data.publicUrl;
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.image_url;
      let finalVideoUrl = formData.video_url;

      // Handle Direct File Uploads
      if (imageFile) {
        finalImageUrl = await uploadMediaToStorage(imageFile, 'images');
      }
      if (videoFile) {
        finalVideoUrl = await uploadMediaToStorage(videoFile, 'videos');
      }

      const optionsArray = [formData.option1, formData.option2, formData.option3, formData.option4];
      const payload = {
        matakuliah: formData.matakuliah,
        topic: formData.topic,
        level: formData.level,
        weight: formData.weight,
        text: formData.text,
        options: optionsArray,
        correct_answer: parseInt(formData.correctAnswer),
        image_url: finalImageUrl || null,
        video_url: finalVideoUrl || null,
        link_url: formData.link_url || null,
      };

      if (editingId) {
        const { error } = await supabase.from('questions').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('questions').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      alert("Gagal menyimpan soal: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menghapus soal ini?")) return;

    try {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) throw error;
      fetchQuestions();
    } catch (err: any) {
      alert("Gagal menghapus soal: " + err.message);
    }
  };

  // CSV Parsing logic
  const parseCSV = (text: string) => {
    const lines: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let currentVal = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"';
          i++; 
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(currentVal.trim());
        lines.push(row);
        row = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    if (row.length > 0 || currentVal !== '') {
      row.push(currentVal.trim());
      lines.push(row);
    }
    return lines;
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length > 1) {
        // Skip header row
        const dataRows = rows.slice(1).filter(r => r.length >= 10 && r[0].trim() !== '');
        const mapped = dataRows.map(r => {
          let level = r[2].toLowerCase();
          if (!['easy', 'medium', 'hard'].includes(level)) level = 'medium';
          
          let correctAnswer = parseInt(r[9]) - 1; // Convert 1-4 to 0-3
          if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) correctAnswer = 0;

          return {
            matakuliah: r[0],
            topic: r[1],
            level: level,
            weight: parseInt(r[3]) || 1,
            text: r[4],
            options: [r[5], r[6], r[7], r[8]],
            correct_answer: correctAnswer,
            image_url: r[10] || null,
            video_url: r[11] || null,
            link_url: r[12] || null,
          };
        });
        setCsvPreview(mapped);
      }
    };
    reader.readAsText(file);
  };

  const handleCsvSubmit = async () => {
    if (user?.id === 'lecturer-001') {
      alert("Aksi ini tidak bisa dilakukan di mode demo.");
      return;
    }
    if (csvPreview.length === 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('questions').insert(csvPreview);
      if (error) throw error;
      
      alert(`Berhasil mengunggah ${csvPreview.length} soal!`);
      setIsCsvModalOpen(false);
      setCsvFile(null);
      setCsvPreview([]);
      fetchQuestions();
    } catch (err: any) {
      alert("Gagal mengunggah CSV: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ["Mata Kuliah", "Topik", "Kesulitan (easy/medium/hard)", "Bobot", "Teks Soal", "Opsi 1", "Opsi 2", "Opsi 3", "Opsi 4", "Jawaban Benar (1-4)", "URL Gambar (opsional)", "URL Video (opsional)", "URL Tautan (opsional)"];
    const sampleRow = ["Pemrograman Berorientasi Objek", "Enkapsulasi", "medium", "1", "Apa tujuan enkapsulasi?", "Menambah bug", "Menyembunyikan data", "Menghapus memori", "Mempercepat kode", "2", "", "", ""];
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + sampleRow.map(v => `"${v}"`).join(",");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_bank_soal.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueMatakuliah = useMemo(() => Array.from(new Set(questions.map(q => q.matakuliah).filter(Boolean))), [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (q.topic && q.topic.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesMk = filterMatakuliah === "all" || q.matakuliah === filterMatakuliah;
      const matchesLevel = filterLevel === "all" || q.level === filterLevel;
      
      return matchesSearch && matchesMk && matchesLevel;
    });
  }, [questions, searchQuery, filterMatakuliah, filterLevel]);

  // Grouping Data
  // mk -> topic -> Question[]
  const groupedData = useMemo(() => {
    return filteredQuestions.reduce((acc, q) => {
      const mk = q.matakuliah || "Lainnya";
      const topic = q.topic || "Tanpa Topik";
      if (!acc[mk]) acc[mk] = {};
      if (!acc[mk][topic]) acc[mk][topic] = [];
      acc[mk][topic].push(q);
      return acc;
    }, {} as Record<string, Record<string, Question[]>>);
  }, [filteredQuestions]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Bank Soal Terpusat</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCsvModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Unggah CSV
          </Button>
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Soal
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 pb-2 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan teks soal atau topik..."
                className="pl-9 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterMatakuliah} onValueChange={setFilterMatakuliah}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Mata Kuliah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mata Kuliah</SelectItem>
                  {uniqueMatakuliah.map(mk => (
                    <SelectItem key={mk} value={mk}>{mk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kesulitan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kesulitan</SelectItem>
                  <SelectItem value="easy">Mudah (Easy)</SelectItem>
                  <SelectItem value="medium">Sedang (Medium)</SelectItem>
                  <SelectItem value="hard">Sulit (Hard)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Database className="h-8 w-8 mb-2 opacity-20" />
              Belum ada soal yang sesuai dengan kriteria.
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedData).map(([mk, topics]) => (
                <AccordionItem key={mk} value={`mk-${mk}`} className="border-b px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-brand" />
                      <span className="font-semibold text-lg">{mk}</span>
                      <Badge variant="outline" className="ml-2 font-normal text-muted-foreground">
                        {Object.values(topics).flat().length} Soal
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <Accordion type="multiple" className="w-full space-y-3 pl-4 border-l-2 ml-2">
                      {Object.entries(topics).map(([topic, qs]) => (
                         <AccordionItem key={topic} value={`topic-${mk}-${topic}`} className="border rounded-md bg-muted/10 px-4">
                           <AccordionTrigger className="hover:no-underline py-3">
                             <div className="flex items-center gap-2">
                               <Folder className="h-4 w-4 text-muted-foreground" />
                               <span className="font-medium">{topic}</span>
                               <Badge variant="secondary" className="ml-2">{qs.length} Soal</Badge>
                             </div>
                           </AccordionTrigger>
                           <AccordionContent className="bg-background rounded-md border mt-2">
                             <Table>
                               <TableHeader className="bg-muted/50">
                                 <TableRow>
                                   <TableHead className="w-[500px]">Teks Soal</TableHead>
                                   <TableHead>Atribut</TableHead>
                                   <TableHead>Media</TableHead>
                                   <TableHead className="text-right">Aksi</TableHead>
                                 </TableRow>
                               </TableHeader>
                               <TableBody>
                                 {qs.sort((a,b) => levelWeight[a.level] - levelWeight[b.level]).map(q => (
                                   <TableRow key={q.id}>
                                     <TableCell className="align-top">
                                       {/* Teks Soal Dinamis (tanpa line-clamp) */}
                                       <div className="text-sm font-medium whitespace-pre-wrap">{q.text}</div>
                                       <div className="text-xs text-muted-foreground mt-3 space-y-1">
                                         {q.options.map((opt, i) => (
                                           <div key={i} className={i === q.correct_answer ? "text-success font-semibold flex items-start" : "flex items-start"}>
                                             <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                                             <span className="whitespace-pre-wrap">{opt}</span>
                                           </div>
                                         ))}
                                       </div>
                                     </TableCell>
                                     <TableCell className="align-top">
                                       <div className="flex flex-col gap-1 items-start">
                                         <Badge variant="outline" className={
                                           q.level === 'easy' ? 'bg-success/10 text-success border-success/20' :
                                           q.level === 'hard' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                           'bg-warning/10 text-warning border-warning/20'
                                         }>
                                           {q.level.toUpperCase()}
                                         </Badge>
                                         <span className="text-[10px] text-muted-foreground">Bobot: {q.weight}</span>
                                       </div>
                                     </TableCell>
                                     <TableCell className="align-top">
                                       <div className="flex flex-col gap-2 text-muted-foreground">
                                         {q.image_url && <div className="flex items-center gap-1 text-xs"><ImageIcon className="h-3 w-3" /> Gambar</div>}
                                         {q.video_url && <div className="flex items-center gap-1 text-xs"><Video className="h-3 w-3" /> Video</div>}
                                         {q.link_url && <div className="flex items-center gap-1 text-xs"><LinkIcon className="h-3 w-3" /> Link</div>}
                                         {!q.image_url && !q.video_url && !q.link_url && <span className="text-xs">-</span>}
                                       </div>
                                     </TableCell>
                                     <TableCell className="align-top text-right">
                                       <div className="flex justify-end gap-2">
                                         <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(q)}>
                                           <Edit className="h-4 w-4" />
                                         </Button>
                                         <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(q.id)}>
                                           <Trash2 className="h-4 w-4" />
                                         </Button>
                                       </div>
                                     </TableCell>
                                   </TableRow>
                                 ))}
                               </TableBody>
                             </Table>
                           </AccordionContent>
                         </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Question Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Soal" : "Tambah Soal Baru"}</DialogTitle>
            <DialogDescription>
              Lengkapi formulir soal di bawah ini. Anda dapat menambahkan media pendukung opsi URL langsung atau mengunggah file.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveQuestion} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mata Kuliah</Label>
                <Input required value={formData.matakuliah} onChange={e => setFormData({...formData, matakuliah: e.target.value})} placeholder="Contoh: Pemrograman Berorientasi Objek" />
              </div>
              <div className="space-y-2">
                <Label>Topik / Bab</Label>
                <Input required value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} placeholder="Contoh: Polimorfisme" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tingkat Kesulitan</Label>
                <Select value={formData.level} onValueChange={v => setFormData({...formData, level: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Mudah (Easy)</SelectItem>
                    <SelectItem value="medium">Sedang (Medium)</SelectItem>
                    <SelectItem value="hard">Sulit (Hard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bobot Nilai</Label>
                <Input type="number" required min="1" value={formData.weight} onChange={e => setFormData({...formData, weight: parseInt(e.target.value) || 1})} />
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <Label>Teks Soal</Label>
              <Textarea 
                required 
                className="min-h-[100px]" 
                value={formData.text} 
                onChange={e => setFormData({...formData, text: e.target.value})} 
                placeholder="Tuliskan pertanyaan Anda di sini..."
              />
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
              <Label className="font-semibold text-brand">Opsi Jawaban & Kunci</Label>
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === (num - 1).toString()}
                    onChange={() => setFormData({...formData, correctAnswer: (num - 1).toString()})}
                    className="h-4 w-4 accent-brand"
                  />
                  <Input 
                    required 
                    value={(formData as any)[`option${num}`]} 
                    onChange={e => setFormData({...formData, [`option${num}`]: e.target.value})} 
                    placeholder={`Pilihan ${num}`} 
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">Pilih radio button di sebelah kiri untuk menandai jawaban yang benar.</p>
            </div>

            <div className="space-y-4 border-t pt-4">
              <Label className="font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" /> Media Pendukung (Opsional)
              </Label>
              
              <div className="grid gap-4">
                {/* Gambar */}
                <div className="space-y-1.5 p-3 border rounded bg-card">
                  <Label className="text-xs font-semibold">Gambar</Label>
                  <p className="text-[10px] text-muted-foreground mb-2">Pilih file gambar dari perangkat Anda ATAU masukkan tautan URL.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setImageFile(e.target.files?.[0] || null)} 
                      className="flex-1 text-xs" 
                    />
                    <div className="flex items-center justify-center"><span className="text-xs font-bold text-muted-foreground">ATAU</span></div>
                    <Input 
                      value={formData.image_url} 
                      onChange={e => setFormData({...formData, image_url: e.target.value})} 
                      placeholder="https://example.com/image.png" 
                      className="flex-1 text-xs"
                      disabled={!!imageFile} 
                    />
                  </div>
                </div>

                {/* Video */}
                <div className="space-y-1.5 p-3 border rounded bg-card">
                  <Label className="text-xs font-semibold">Video</Label>
                  <p className="text-[10px] text-muted-foreground mb-2">Pilih file video (MP4) dari perangkat Anda ATAU masukkan tautan YouTube.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input 
                      type="file" 
                      accept="video/*" 
                      onChange={e => setVideoFile(e.target.files?.[0] || null)} 
                      className="flex-1 text-xs" 
                    />
                    <div className="flex items-center justify-center"><span className="text-xs font-bold text-muted-foreground">ATAU</span></div>
                    <Input 
                      value={formData.video_url} 
                      onChange={e => setFormData({...formData, video_url: e.target.value})} 
                      placeholder="https://youtube.com/watch?v=..." 
                      className="flex-1 text-xs"
                      disabled={!!videoFile} 
                    />
                  </div>
                </div>

                {/* Link Tautan */}
                <div className="space-y-1.5 p-3 border rounded bg-card">
                  <Label className="text-xs font-semibold">Tautan Eksternal (Link)</Label>
                  <Input 
                    value={formData.link_url} 
                    onChange={e => setFormData({...formData, link_url: e.target.value})} 
                    placeholder="https://wikipedia.org/wiki/..." 
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Menyimpan & Mengunggah..." : "Simpan Soal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* CSV Upload Modal */}
      <Dialog open={isCsvModalOpen} onOpenChange={setIsCsvModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unggah Soal via CSV</DialogTitle>
            <DialogDescription>
              Masukkan ratusan soal sekaligus menggunakan template CSV. Pastikan format kolom sesuai dengan template yang disediakan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-4 rounded-lg border border-dashed">
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-semibold">1. Unduh Template</h4>
                <p className="text-xs text-muted-foreground">Gunakan template ini untuk mengisi data soal menggunakan Excel atau Google Sheets, lalu Export sebagai .CSV (Comma Separated Values).</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" /> Template CSV
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold">2. Pilih File CSV</h4>
              <Input type="file" accept=".csv" onChange={handleCsvFileChange} />
            </div>

            {csvPreview.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-brand">3. Pratinjau Data ({csvPreview.length} Soal terdeteksi)</h4>
                  <span className="text-xs text-muted-foreground">Periksa kembali kolom yang terbaca sebelum menekan tombol Unggah.</span>
                </div>
                
                <div className="border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-muted sticky top-0">
                      <TableRow>
                        <TableHead className="w-[200px]">Teks Soal</TableHead>
                        <TableHead>MK / Topik</TableHead>
                        <TableHead>Kesulitan</TableHead>
                        <TableHead>Jawaban</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvPreview.slice(0, 10).map((r, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs line-clamp-2">{r.text}</TableCell>
                          <TableCell className="text-xs">{r.matakuliah} - {r.topic}</TableCell>
                          <TableCell className="text-xs">{r.level}</TableCell>
                          <TableCell className="text-xs text-success font-semibold">Opsi {r.correct_answer + 1}</TableCell>
                        </TableRow>
                      ))}
                      {csvPreview.length > 10 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-xs text-muted-foreground p-2 bg-muted/20">
                            ... dan {csvPreview.length - 10} soal lainnya
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="ghost" onClick={() => { setCsvFile(null); setCsvPreview([]); }}>Batal / Reset</Button>
                  <Button onClick={handleCsvSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                    Unggah {csvPreview.length} Soal ke Database
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
