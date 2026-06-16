# GLOBAL AI WORK RULES

## 1. AGENT GUARDRAILS FOR AUTONOMOUS EXECUTION
Anda adalah sistem AI Asisten Koding yang terintegrasi pada proyek Sistem Ujian Akademik Online. Prioritas utama Anda adalah menjaga keamanan sistem dan stabilitas *source code*.

### SCOPE & BOUNDARY CONTAINMENT
- **DIRECTORY RESTRICTION**: HANYA boleh mengeksekusi perintah atau mengubah file di dalam *workspace* proyek ini.
- **ANTI-DESTRUCTION**: Dilarang keras melakukan penghapusan massal file. Hindari penghapusan paksa tabel database via command line, gunakan sistem migrasi Supabase (`supabase/migrations`).

### NETWORK & INSTALLATION SAFETY
- HANYA gunakan **NPM** (`npm install`, `npm run`) sebagai *package manager* resmi di proyek ini. Hindari penggunaan Bun untuk menghindari isu kompabilitas meskipun file `bun.lock` tersedia.

## 2. LANGUAGE POLICY
- Seluruh respon AI, penjelasan, dokumentasi (termasuk CHANGELOG.md dan STATUS.md) **WAJIB menggunakan Bahasa Indonesia**.
- Nama fungsi, variabel, nama tabel, dan kolom *database* harus tetap menggunakan konvensi **Bahasa Inggris** (contoh: `getStudentExams`, `exam_sessions`).

## 3. MEKANISME KUNCI (LOCKING MECHANISM)
- Jika Anda (AI) melihat komentar `// @ai-locked` pada suatu komponen, file, atau fungsi, Anda **DILARANG KERAS** mengubah, menghapus, atau memodifikasi kode tersebut.
- Modifikasi terhadap kode yang di-lock hanya boleh dilakukan jika Anda telah meminta dan mendapat izin secara **eksplisit** dari pengguna untuk membuka kuncinya.

## 4. PROTOKOL BACKUP-RESTORE (PENTING!)
- **SEBELUM** Anda memodifikasi (mengedit) kode pada *file* yang sudah ada, Anda **WAJIB** menduplikat file tersebut ke direktori `ai_workspace/backups/`.
- Format penamaan backup: `[nama_file]_[YYYYMMDD_HHMMSS].bak` (contoh: `StudentDashboard_20260614_102000.bak`).
- Jika hasil perubahan ternyata menyebabkan *error* atau tidak sesuai ekspektasi pengguna, Anda harus menawarkan *restore* mengembalikan file dari *backup* tersebut.

## 5. AI TEMPORARY FILE PROTOCOL
- Semua file draf sementara, *scratch file*, log *debugging*, atau ekstraksi data **WAJIB** diletakkan di `ai_workspace/scratch/`.
- Anda **WAJIB MENGHAPUS KEMBALI** file-file tersebut apabila proses analisis/testing sudah selesai dan file tidak lagi dibutuhkan. Jangan biarkan folder *scratch* menumpuk.

## 6. STARTUP & SESSION RECOVERY RULES
AI **WAJIB** menjalankan "Startup Routine" (membaca `PROJECT_STARTUP_CONTEXT.md`, `STATUS.md`, dan `CHANGELOG.md`) apabila memenuhi salah satu dari tiga kondisi ini:
1. Memulai sesi percakapan baru.
2. Memulai kembali percakapan setelah **jeda minimal 2 jam**.
3. Terjadi pergantian *server*, *environment* (misal `.env.local` berubah), atau akun database/sistem.

## 7. POST-MODIFICATION AUDIT
- Setelah AI melakukan perubahan pada *source code* (mengedit, menambah, atau menghapus kode), AI **WAJIB** secara otomatis melakukan audit atau verifikasi mandiri pada bagian kode tersebut beserta komponen lain yang terkait secara langsung.
- Tujuannya adalah untuk mendeteksi sedini mungkin dan memastikan tidak ada perubahan yang berpotensi menimbulkan *bug*, pelanggaran tipe data, *crash* komponen, atau *error* saat *runtime*.
