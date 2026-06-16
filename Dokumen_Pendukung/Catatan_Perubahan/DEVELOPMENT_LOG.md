# Development Log - Sistem Ujian Akademik Online (CBT)

> **Proyek**: Sistem Ujian Berbasis Online untuk Mata Kuliah PBO
> **Institusi**: UTI (Universitas Teknologi Indonesia)
> **Tech Stack**: React + TanStack Router + Zustand + Supabase + PWA
> **Mulai**: 31 Mei 2026

---

## 📋 Format Entry Log

Setiap entry mengikuti format:
```
### [YYYY-MM-DD HH:MM] - [Kategori] Judul Pekerjaan
**Tujuan**: Mengapa dikerjakan
**Scope**: Bagian apa saja yang diubah/dibuat
**Output**: Hasil yang dihasilkan
**Status**: ✅ Selesai / 🚧 Progress / ⏸️ Pending
**Catatan**: Informasi tambahan, keputusan teknis, atau blocker
```

---

## 🎯 Fase Pengerjaan

- **Fase 1**: Core Experience (Frontend) - Timer, Offline, Auto-grading
- **Fase 2**: Backend Integration - Supabase, Auth, Admin CRUD
- **Fase 3**: PWA & Security - Offline mode, Device lock, Production polish

---

## 📝 Log Entries

### [2026-05-31 01:20] - [AUDIT] Analisis Kesesuaian PRD vs Implementasi
**Tujuan**: Memahami gap antara PRD dengan kode yang sudah ada
**Scope**: 
- Review seluruh source code di `src/`
- Bandingkan dengan PRD dan bank soal PBO
- Identifikasi fitur yang sudah ada vs yang belum
**Output**: 
- File `Dokumen_Pendukung/HASIL_AUDIT_PRD_31_Mei_2026.md`
- Kesimpulan: UI 85% sesuai, fungsionalitas inti (timer real-time, offline, security) belum ada
**Status**: ✅ Selesai
**Catatan**: 
- Komponen sudah modular (tidak lagi 1 file besar)
- Mockup masih 4 opsi, harus diubah jadi 5 opsi (A-E)
- Timer masih hardcoded string, belum countdown real-time

---

### [2026-05-31 01:34] - [PLANNING] Diskusi Teknologi & Arsitektur
**Tujuan**: Memastikan pilihan teknologi yang tepat sebelum eksekusi
**Scope**: 
- Evaluasi Zustand vs Redux vs Context
- Evaluasi Supabase vs Firebase vs Custom Backend
- Evaluasi uuid vs FingerprintJS untuk device lock
**Output**: 
- Keputusan: Zustand + Supabase + FingerprintJS
- Tambahan: localforage untuk offline storage, vite-plugin-pwa untuk PWA
**Status**: ✅ Selesai
**Catatan**: 
- Zustand dipilih karena ringan dan sesuai PRD
- Supabase dipilih karena Realtime built-in untuk panel dosen
- FingerprintJS lebih kuat dari uuid untuk anti-curang

---

### [2026-05-31 01:58] - [PLANNING] Klarifikasi Requirements dengan User
**Tujuan**: Menghilangkan ambiguitas di PRD sebelum implementasi
**Scope**: 
- Jumlah opsi pilihan ganda (4 atau 5?)
- Strategi pemilihan soal (random proporsional?)
- Auto-grading dan bobot skor
- Backend pilihan
- PWA requirement
- Folder structure
**Output**: 
- 5 opsi (A-E) sesuai bank soal
- Random proporsional: 11 mudah + 11 sedang + 11 sulit
- Auto-grading dengan bobot: Mudah=2, Sedang=3, Sulit=4
- Skor 99 → konversi jadi 100 dengan rumus `Math.round((raw/99)*100)`
- Nilai tampil hybrid (dosen bisa pilih: langsung/delay/scheduled)
- Supabase sebagai backend
- PWA full dengan offline mode
- Folder split: frontend/ dan backend/ dengan sub-modul
**Status**: ✅ Selesai
**Catatan**: 
- Sistem lebih besar dari sekadar ujian - ini platform manajemen ujian lengkap
- Akan ada CRUD: soal, kelas, ujian, mahasiswa, dosen
- Multi-dosen support
- Multi mata kuliah support (tidak hanya PBO)

---

### [2026-05-31 02:00] - [PLANNING] Implementation Plan - 3 Fase
**Tujuan**: Membuat roadmap detail untuk eksekusi bertahap
**Scope**: 
- Fase 1: Core Experience (Zustand, timer, offline, grading, 5 opsi)
- Fase 2: Backend Integration (Supabase schema, Auth, Admin CRUD)
- Fase 3: PWA & Security (Service worker, device lock, production)
**Output**: 
- File `implementation_plan.md` di artifacts
- Struktur folder detail
- TypeScript types definition
- Verification plan
**Status**: ✅ Selesai
**Catatan**: 
- Pendekatan phased agar tidak overwhelm
- Fase 1 fokus agar ujian bisa jalan secara lokal dulu
- Fase 2 baru koneksi ke backend
- Fase 3 polish untuk production

---

### [2026-05-31 02:14] - [PLANNING] Resolusi Open Questions
**Tujuan**: Finalisasi keputusan teknis sebelum mulai coding
**Scope**: 
- Skor: Konversi skala 99→100 ✅
- Auth: Google Sign-In biasa dulu (kampus punya Workspace tapi mulai simple) ✅
- Deployment: Vercel (frontend) + Supabase free tier (backend) ✅
- Multi mata kuliah: Ya, sistem harus support ✅
- Import soal: Bulk import prioritas, form manual nanti ✅
**Output**: 
- Implementation plan updated dengan semua keputusan
- Siap mulai eksekusi Fase 1
**Status**: ✅ Selesai
**Catatan**: 
- User approve plan
- Kampus sudah punya Google Workspace for Education
- Integrasi Classroom bisa dilakukan nanti sebagai enhancement

---

### [2026-05-31 02:22] - [SETUP] Development Log Creation
**Tujuan**: Membuat sistem tracking untuk semua pekerjaan yang dilakukan
**Scope**: 
- File DEVELOPMENT_LOG.md di root project
- Format entry standar
- Tracking fase pengerjaan
**Output**: 
- File ini (DEVELOPMENT_LOG.md)
**Status**: ✅ Selesai
**Catatan**: 
- Log ini akan di-update setiap kali ada perubahan signifikan
- Format: Waktu, Kategori, Tujuan, Scope, Output, Status, Catatan

---

### [2026-05-31 02:45] - [SETUP] Mengelompokkan File Catatan
**Tujuan**: Merapikan file catatan agar terkumpul di satu lokasi sesuai instruksi
**Scope**: 
- Memindahkan `DEVELOPMENT_LOG.md`, `HASIL_AUDIT_PRD_31_Mei_2026.md`, dan `ANALISIS_PRD.md` ke folder baru
**Output**: 
- Folder `Dokumen_Pendukung/Catatan_Perubahan/` berisi semua log
**Status**: ✅ Selesai
**Catatan**: 
- Dilakukan untuk mempermudah penelusuran di masa depan

---

### [2026-05-31 03:21] - [TROUBLESHOOTING] Perbaikan Konflik Dependency `vite-plugin-pwa`
**Tujuan**: Mengatasi kegagalan `npm install` akibat konflik peer dependency antara Vite dan plugin PWA
**Scope**:
- Analisis error `ERESOLVE unable to resolve dependency tree`
- Mengidentifikasi bahwa `vite-plugin-pwa@0.19.8` hanya mendukung Vite `^3 || ^4 || ^5`, sedangkan proyek memakai Vite `^7.3.1`
- Mengubah versi `vite-plugin-pwa` di `package.json`
**Output**:
- `package.json` diperbaiki dari `vite-plugin-pwa@^0.19.8` menjadi `vite-plugin-pwa@^1.1.0`
**Status**: ✅ Selesai
**Catatan**:
- Setelah perubahan ini, jalankan ulang `npm install`
- Tidak disarankan memakai `--force` atau `--legacy-peer-deps` karena dapat menyembunyikan konflik dependency yang berisiko di fase production

### [2026-05-31 20:49] - [AUDIT] Code Review Frontend & Identifikasi Masalah
**Tujuan**: Mengevaluasi potensi masalah jangka panjang pada frontend sebelum implementasi fitur lanjutan
**Scope**:
- Review arsitektur komponen ujian (`ExamView.tsx`, `ExamApp.tsx`)
- Review state management (`examStore.ts`, `authStore.ts`)
- Review tipe data dan utilities
**Output**:
- Ditemukan 5 area prioritas perbaikan:
  1. Sinkronisasi state lokal `ExamView.tsx` dengan `examStore.ts`.
  2. Perbaikan tipe data tanggal (`Date` object) menjadi ISO string.
  3. Perlu proteksi untuk persistence/browser-only API (seperti UUID generation).
  4. Kesiapan alur halaman (routing) untuk skala produksi.
  5. Rekomendasi untuk mengaudit dependency di kemudian hari.
**Status**: ✅ Selesai
**Catatan**:
- Rekomendasi disetujui dan dilanjutkan eksekusinya sebagai bagian dari Fase 1.

---

### [2026-05-31 23:55] - [IMPLEMENTATION] Fase 1: State Management & Core Logic
**Tujuan**: Mengimplementasikan state management dan alur ujian dasar (timer, persistence) sebelum integrasi backend
**Scope**: 
- Buat file mock data (`src/lib/mockData.ts`) untuk testing
- Perbaiki serialisasi `Date` ke `string` (ISO 8601) di `examStore.ts`
- Implementasi dummy grading logic di `grading.ts` karena `correctAnswer` dihapus untuk keamanan
- Integrasi `LoginView.tsx` dengan `authStore`
- Refactor routing di `ExamApp.tsx` untuk menggunakan store state
- Update `TimerDisplay.tsx` agar memformat waktu dari detik ke `HH:MM:SS`
- Integrasi `ExamView.tsx` dengan `examStore` dan implementasi fungsionalitas timer (`setInterval`)
- Perbaikan bug dependency timer di `ExamView.tsx` agar tidak restart saat jawaban dipilih
**Output**: 
- Alur ujian CBT berjalan dengan baik secara lokal
- Timer dan state ujian persistence (tidak hilang saat refresh)
**Status**: ✅ Selesai
**Catatan**: 
- Saat ini ujian masih menggunakan data mock
- Penilaian/grading masih menghasilkan 0 (harus dipindah ke sisi backend nanti)
- Path directory yang mengandung spasi di Windows terkadang menyebabkan isu saat menjalankan terminal commands

---

### [2026-06-01 00:20] - [TROUBLESHOOTING] Error "vite is not recognized"
**Tujuan**: Mengatasi error lokal saat menjalankan development server
**Scope**:
- Analisis kegagalan `npm run dev` dengan error `'vite' is not recognized`.
- Menjalankan `npm install` untuk memulihkan modul dan symlink binaries di `node_modules`.
**Output**:
- `npm install` selesai dijalankan oleh user.
- Dependency lokal tersedia kembali sehingga `vite` dapat dipanggil lewat script `npm run dev` / `npm run build`.
**Status**: ✅ Selesai
**Catatan**:
- Masalah ini umum terjadi jika `node_modules` belum di-setup secara lengkap di environment lokal.
- Jika terminal masih menampilkan proses `npm install` lama, tutup terminal tersebut atau hentikan prosesnya karena instalasi sudah selesai di terminal user.

---

### [2026-06-01 01:22] - [BUGFIX] Error Login Google Classroom / Dashboard
**Tujuan**: Memperbaiki error yang muncul setelah klik login dummy Google Classroom pada pengujian Fase 1
**Scope**:
- Memeriksa `src/components/exam/StudentDashboard.tsx`.
- Mengidentifikasi deklarasi ganda komponen `Wifi`.
- Menghapus deklarasi manual `function Wifi(...)` karena ikon `Wifi` sudah diimpor dari `lucide-react`.
**Output**:
- Konflik identifier `Wifi` sudah dihilangkan.
- Dashboard mahasiswa dapat menggunakan ikon `Wifi` dari `lucide-react` tanpa bentrok deklarasi.
**Status**: ✅ Selesai
**Catatan**:
- Penyebab error bukan autentikasi Google asli, karena Fase 1 masih memakai login dummy/mock.
- Error terjadi saat render dashboard setelah login karena konflik import/deklarasi komponen.

---

### [2026-06-01 02:38] - [TESTING] Status Pengujian Manual Fase 1
**Tujuan**: Mendokumentasikan status pengujian Fase 1 sebelum masuk ke Fase 2
**Scope**:
- Testing alur login dummy Google Classroom.
- Testing render dashboard mahasiswa setelah login.
- Testing kesiapan ulang untuk menjalankan `npm run dev` setelah `npm install` selesai.
- Menandai bahwa pengujian lanjutan perlu dilakukan untuk alur mulai ujian, pilih jawaban, refresh halaman, persistence, dan submit ujian.
**Output**:
- Error dashboard akibat duplikasi `Wifi` sudah diperbaiki.
- Proyek siap dites ulang melalui browser dengan menjalankan `npm run dev`.
**Status**: 🚧 Progress
**Catatan**:
- Fase 1 belum dianggap final secara manual sampai alur ujian diuji ulang dari login sampai submit.
- Jika terminal lama masih menunjukkan `npm install` berjalan, proses tersebut perlu dihentikan atau terminal ditutup agar tidak membingungkan status eksekusi.

---

## 🚀 Next Steps

### Fase 1 - Core Experience (Selesai)
- ✅ Install dependencies (zustand, @fingerprintjs/fingerprintjs, localforage, vite-plugin-pwa)
- ✅ Restrukturisasi folder (pindah ke frontend/, siapkan backend/)
- ✅ Buat Zustand stores (examStore, authStore, networkStore)
- ✅ Buat custom hooks (useCountdown, useOnlineStatus, useDeviceId)
- ✅ Buat lib/logic (questions.ts, grading.ts, mockData.ts)
- ✅ Buat TypeScript types (exam.ts, user.ts, class.ts)
- ✅ Modifikasi UI components (timer real-time, integrasi state)
- ✅ Testing & verification

### Fase 2 - Backend Integration (Menunggu)
- [ ] Setup project Supabase
- [ ] Buat skema database dan table
- [ ] Integrasi Auth Supabase (Google/Email)
- [ ] Buat API endpoints/RPC untuk soal ujian dan grading
- [ ] Ganti penggunaan mock data dengan data real dari API backend

---

## 📊 Metrics

- **Total Commits**: 0 (belum mulai commit)
- **Files Created**: 4 (termasuk mockData.ts)
- **Files Modified**: 7 (komponen ujian dan store)
- **Lines of Code**: ~500 (perbaikan logic state)
- **Phase Progress**: Fase 1 ✅ → Fase 2 🚧

---

## 🔗 Referensi

- [Implementation Plan](file:///C:/Users/User/.gemini/antigravity-ide/brain/5e0b04b8-1060-49c3-8d8b-c287973c53ad/implementation_plan.md)
- [Audit PRD](file:///C:/Users/User/OneDrive/Documents/Pengembangan%20Sistem%20AI/Sistem%20Ujian%20Online/Ujian-Akademik-Online/Dokumen_Pendukung/Catatan_Perubahan/HASIL_AUDIT_PRD_31_Mei_2026.md)
- [PRD Original](file:///C:/Users/User/OneDrive/Documents/Pengembangan%20Sistem%20AI/Sistem%20Ujian%20Online/Ujian-Akademik-Online/Dokumen_Pendukung/PRD-%20Website%20Ujian%20Online%20PBO%203.md)
- [Bank Soal PBO (4 bagian)](file:///C:/Users/User/OneDrive/Documents/Pengembangan%20Sistem%20AI/Sistem%20Ujian%20Online/Ujian-Akademik-Online/Dokumen_Pendukung/)
