# PROJECT STARTUP CONTEXT

## INFORMASI PROYEK
- **Project Name**: Sistem Ujian Akademik Online
- **Status**: Development
- **Lokasi Project**: Direktori kerja saat ini
- **Lokasi AI Workspace**: `ai_workspace/`

## TECHNOLOGY STACK
- **Framework UI**: React 19 + Vite
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Backend / Database**: Supabase (PostgreSQL) - **Cloud Edition**
- **Styling**: Tailwind CSS v4, Radix UI (shadcn/ui-like components)
- **Package Manager**: NPM

## TUJUAN UTAMA
Membangun sistem ujian *online* yang tangguh, real-time, dan aman bagi mahasiswa dan dosen, serta memastikan antarmuka yang sangat estetik (modern, dinamis, *premium look*).

## ATURAN WAJIB INISIALISASI AI (STARTUP ROUTINE)
Setiap kali AI Asisten **memulai percakapan/sesi baru**, **melanjutkan percakapan setelah jeda lebih dari 2 jam**, atau **beralih lingkungan/server/akun**, AI **DIWAJIBKAN** secara otomatis:
1. Membaca berkas `ai_workspace/knowledge/rules/GLOBAL_AI_WORK_RULES.md` untuk memverifikasi batasan keamanan (termasuk *backup-restore* dan aturan *locking*).
2. Membaca berkas `ai_workspace/sandbox/active/STATUS.md` untuk mengetahui apa yang sedang dikerjakan saat ini, apa error terakhirnya, dan apa langkah selanjutnya (*TODO*).
3. Membaca berkas `ai_workspace/sandbox/active/CHANGELOG.md` untuk melihat riwayat fitur yang sudah berhasil diimplementasikan agar mendapat konteks berkesinambungan.
