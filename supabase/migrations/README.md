# Database Migrations

Folder ini berisi SQL migrations untuk setup database Supabase.

## Cara Menjalankan Migrations

### Opsi 1: Via Supabase Dashboard (Recommended untuk Development)

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda: `ujian-akademik-online`
3. Di sidebar kiri, klik **SQL Editor**
4. Jalankan migrations secara berurutan:

   **a. Migration 01 - Users Table**
   - Klik "New Query"
   - Copy-paste isi file `01_create_users.sql`
   - Klik "Run" atau tekan `Ctrl+Enter`
   - Pastikan muncul "Success. No rows returned"

   **b. Migration 02 - Exam Configs Table**
   - Klik "New Query"
   - Copy-paste isi file `02_create_exam_configs.sql`
   - Klik "Run"

   **c. Migration 03 - Questions Table**
   - Klik "New Query"
   - Copy-paste isi file `03_create_questions.sql`
   - Klik "Run"

   **d. Migration 04 - Exam Sessions Table**
   - Klik "New Query"
   - Copy-paste isi file `04_create_exam_sessions.sql`
   - Klik "Run"

   **e. Migration 05 - Exam Answers Table**
   - Klik "New Query"
   - Copy-paste isi file `05_create_exam_answers.sql`
   - Klik "Run"

5. **Verifikasi**: Di sidebar kiri, klik **Table Editor**
   - Anda harus melihat 5 tabel baru:
     - `users`
     - `exam_configs`
     - `questions`
     - `exam_sessions`
     - `exam_answers`

### Opsi 2: Via Supabase CLI (Recommended untuk Production)

```bash
# Install Supabase CLI (jika belum)
npm install -g supabase

# Login ke Supabase
supabase login

# Link project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

## Struktur Database

### 1. users
- Menyimpan data mahasiswa dan dosen
- Terintegrasi dengan Supabase Auth
- RLS: User hanya bisa lihat data sendiri, dosen bisa lihat semua

### 2. exam_configs
- Menyimpan konfigurasi ujian (durasi, jumlah soal, distribusi level)
- RLS: Semua user bisa lihat, hanya dosen yang bisa create/update/delete

### 3. questions
- Menyimpan soal ujian dengan pilihan jawaban
- **Pilihan disimpan sebagai array** (tanpa label A/B/C/D)
- **correct_answer disimpan sebagai index** (0-4)
- **Mendukung randomisasi** via function `get_randomized_questions()`
- RLS: Mahasiswa bisa lihat soal (tanpa correct_answer), dosen bisa lihat semua

### 4. exam_sessions
- Menyimpan sesi ujian aktif mahasiswa
- Menyimpan mapping randomisasi soal dan pilihan
- Auto-expiry jika waktu habis
- RLS: Mahasiswa hanya bisa lihat/update sesi sendiri, dosen bisa lihat semua

### 5. exam_answers
- Menyimpan jawaban mahasiswa untuk setiap soal
- **answer disimpan sebagai index** (0-4), bukan huruf
- RLS: Mahasiswa hanya bisa lihat/update jawaban sendiri, dosen bisa lihat semua

## Fitur Keamanan (Row Level Security)

Semua tabel menggunakan RLS untuk memastikan:
- Mahasiswa tidak bisa melihat `correct_answer`
- Mahasiswa tidak bisa melihat data mahasiswa lain
- Mahasiswa tidak bisa mengubah sesi/jawaban setelah submit
- Dosen memiliki akses penuh untuk monitoring dan grading

## Fitur Randomisasi

Function `get_randomized_questions()` akan:
1. Mengacak urutan soal berdasarkan hash(question_id + student_id)
2. Mengacak urutan pilihan jawaban berdasarkan hash(question_id + student_id + option_index)
3. Mengembalikan mapping untuk konversi jawaban mahasiswa ke index asli

Setiap mahasiswa akan mendapat urutan soal dan pilihan yang berbeda, tapi konsisten (tidak berubah saat refresh).
