# CHANGELOG: Modul dan Fitur

Dokumen ini melacak semua fitur yang **sudah berhasil** diimplementasikan ke dalam proyek Ujian Akademik Online. Urutkan dari yang terbaru ke terlama.

## [2026-06-14] Integrasi AI Workspace
- **Added**: Direktori `ai_workspace/` untuk menyimpan log, *scratch*, aturan (*rules*), dan *backup*.
- **Added**: Aturan global AI, *startup context*, dan standar pengembangan sandbox AI.
- **Implemented**: Mekanisme `STATUS.md` dan `CHANGELOG.md` untuk melacak progres pengembangan (memudahkan AI mengingat konteks).

## [Sebelumnya] Inisialisasi Proyek Ujian Akademik Online
- **Database**: Skema Supabase telah dibuat (`users`, `exam_configs`, `questions`, `exam_sessions`, `exam_answers`).
- **Trigger Database**: Menambahkan validasi domain email (`06_restrict_email_domain.sql`).
- **Frontend Framework**: Setup Vite, React, TanStack Router, Tailwind CSS v4.
- **State Management**: Setup `authStore`, `examStore`, `networkStore` menggunakan Zustand.
- **Views**: Pembuatan dasar halaman *Login*, *StudentDashboard*, *LecturerDashboard*, *ExamView*, dan *ResultView*.
