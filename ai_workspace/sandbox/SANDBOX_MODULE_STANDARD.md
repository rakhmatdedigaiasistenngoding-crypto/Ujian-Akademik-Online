# Standar Pengembangan Modul (Sandbox)

Dokumen ini berisi panduan dan aturan baku (*Standard Operating Procedure*) untuk pengembangan modul atau fitur baru di proyek Ujian Akademik Online.

## 1. Arsitektur Database & Migrasi (Tingkat 1)
Karena kita menggunakan **Supabase Cloud**, perubahan langsung ke Production Database sangat berbahaya. AI **WAJIB** mematuhi aturan berikut:
- **DILARANG** menghapus tabel (*DROP TABLE*) atau melakukan manipulasi destruktif tanpa konfirmasi pengguna dan *backup*.
- Semua perubahan skema database harus dilakukan melalui file SQL baru di dalam direktori `supabase/migrations/` dengan penomoran yang benar (contoh: `07_create_feature_x.sql`).
- **Data Uji Coba (Dummy)**: Jika membutuhkan data untuk pengujian antarmuka, dilarang langsung melakukan `INSERT` ke Cloud DB secara manual. Harap catat query tersebut di `supabase/seed.sql` agar dapat dijalankan ulang jika diperlukan.

## 2. State Management & API (Tingkat 2)
Seluruh logika klien harus mengikuti standar arsitektur `Zustand`:
- Pemanggilan API ke Supabase dilakukan melalui fungsi di dalam `stores/*.ts`. Jangan melakukan fetch data mentah secara langsung di dalam komponen UI jika logika tersebut kompleks.
- Pemisahan *store* harus jelas (misal: `authStore.ts` untuk login, `examStore.ts` untuk sesi ujian).

## 3. UI/UX dan Komponen (Tingkat 3)
Estetika adalah prioritas. Saat membuat antarmuka, AI wajib:
- Mempertahankan standar estetika tinggi (*WOW effect*, desain premium, responsif, *micro-animations*).
- Menggunakan komponen *shadcn/ui* atau Radix UI bawaan yang sudah di-install.
- Menghindari penggunaan warna generik. Gunakan palet warna modern berbasis Tailwind (v4).

## 4. Alur Pembuatan Fitur (Feature Branching / Isolation)
Saat pengguna meminta pembuatan modul baru (contoh: "Pembuatan Halaman Nilai"), AI akan:
1. Mencatat *TODO* di `ai_workspace/sandbox/active/STATUS.md`.
2. Melakukan *backup* setiap file *existing* yang akan disentuh ke `ai_workspace/backups/`.
3. Mengerjakan UI, menghubungkan ke Store, lalu merancang Migrasi Database (jika perlu).
4. Setelah diverifikasi selesai, update `CHANGELOG.md` dan bersihkan semua file dari `ai_workspace/scratch/`.
