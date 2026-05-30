# Product Requirements Document (PRD)
**Nama Produk:** Sistem Ujian Berbasis Online (CBT) Terintegrasi
**Platform:** Progressive Web Application (PWA) / Responsive Web
**Tech Stack:** React/Next.js (Frontend), TailwindCSS, Shadcn UI, Zustand (Local State). Backend menyusul (Antigravity/Supabase).

## 1. Ringkasan Eksekutif
Aplikasi ujian CBT ringan, berdesain mobile-first, offline-first, dan aman dari kecurangan (single active device).

## 2. Pengguna & Hak Akses
* Mahasiswa: Mengikuti ujian di 1 perangkat, navigasi soal, melihat sisa waktu, indikator online/offline, dan hasil akhir.
* Dosen: Mengawasi pengerjaan, buka kesempatan remedial, reset sesi perangkat, dan melihat rekap nilai.

## 3. Spesifikasi Fitur Utama
* Pengacakan & Penyajian Soal: Menampilkan 1 soal per layar. Grid Mapping Soal di sidebar (Desktop) atau Bottom Sheet (Mobile). Warna hijau untuk terjawab, putih untuk belum.
* Kinerja & Ketahanan Jaringan: Indikator status jaringan (🟢 Online / 🔴 Offline). Fitur Auto-Retry saat submit dalam keadaan offline.
* Manajemen Waktu: Waktu ujian 100 menit. Toleransi diskoneksi 10 menit sebelum auto-submit.
* Keamanan: Penguncian satu perangkat (device token binding).

## 4. Struktur Folder Proyek (Frontend & Backend Terpisah)
Struktur ini wajib diikuti untuk memudahkan pemisahan pengerjaan UI dan integrasi ke backend Antigravity di tahap selanjutnya.

proyek-ujian-online/
├── .github/                   
├── frontend/                  
│   ├── public/                
│   ├── src/                   
│   │   ├── components/        
│   │   ├── pages/             
│   │   ├── styles/            
│   │   └── utils/             
│   ├── package.json           
│   └── README-frontend.md     
├── backend/                   
│   ├── controllers/           
│   ├── models/                
│   ├── routes/                
│   └── antigravity_config/    
├── .gitignore                 
└── README.md