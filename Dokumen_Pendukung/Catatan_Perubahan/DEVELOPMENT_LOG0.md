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

## 🚀 Next Steps

### Fase 1 - Core Experience (Sedang Dikerjakan)
- [ ] Install dependencies (zustand, @fingerprintjs/fingerprintjs, localforage, vite-plugin-pwa)
- [ ] Restrukturisasi folder (pindah ke frontend/, siapkan backend/)
- [ ] Buat Zustand stores (examStore, authStore, networkStore)
- [ ] Buat custom hooks (useCountdown, useOnlineStatus, useDeviceId)
- [ ] Buat lib/logic (questions.ts, grading.ts)
- [ ] Buat TypeScript types (exam.ts, user.ts, class.ts)
- [ ] Modifikasi UI components (5 opsi, timer real-time, online/offline badge)
- [ ] Testing & verification

---

## 📊 Metrics

- **Total Commits**: 0 (belum mulai coding)
- **Files Created**: 2 (HASIL_AUDIT_PRD_31_Mei_2026.md, DEVELOPMENT_LOG.md)
- **Files Modified**: 1 (implementation_plan.md)
- **Lines of Code**: 0 (planning phase)
- **Phase Progress**: Planning ✅ → Fase 1 🚧

---

## 🔗 Referensi

- [Implementation Plan](file:///C:/Users/User/.gemini/antigravity-ide/brain/5e0b04b8-1060-49c3-8d8b-c287973c53ad/implementation_plan.md)
- [Audit PRD](file:///C:/Users/User/OneDrive/Documents/Pengembangan%20Sistem%20AI/Sistem%20Ujian%20Online/Ujian-Akademik-Online/Dokumen_Pendukung/HASIL_AUDIT_PRD_31_Mei_2026.md)
- [PRD Original](file:///C:/Users/User/OneDrive/Documents/Pengembangan%20Sistem%20AI/Sistem%20Ujian%20Online/Ujian-Akademik-Online/Dokumen_Pendukung/PRD-%20Website%20Ujian%20Online%20PBO%203.md)
- [Bank Soal PBO (4 bagian)](file:///C:/Users/User/OneDrive/Documents/Pengembangan%20Sistem%20AI/Sistem%20Ujian%20Online/Ujian-Akademik-Online/Dokumen_Pendukung/)
