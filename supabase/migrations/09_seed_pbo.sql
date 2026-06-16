-- Seed Data for PBO Exam

DO $$
DECLARE
  v_exam_id UUID;
BEGIN
  -- Hapus exam lama jika ada (untuk re-seed yang bersih)
  DELETE FROM public.questions WHERE exam_id IN (
    SELECT id FROM public.exam_configs WHERE title = 'Kuis Pemrograman Berorientasi Objek'
  );
  DELETE FROM public.exam_sessions WHERE exam_id IN (
    SELECT id FROM public.exam_configs WHERE title = 'Kuis Pemrograman Berorientasi Objek'
  );
  DELETE FROM public.exam_configs WHERE title = 'Kuis Pemrograman Berorientasi Objek';

  -- Buat Exam Config baru
  v_exam_id := gen_random_uuid();
  INSERT INTO public.exam_configs (id, title, duration, total_questions, distribution, score_release, max_retakes)
  VALUES (v_exam_id, 'Kuis Pemrograman Berorientasi Objek', 60, 45, '{"easy": 15, "medium": 15, "hard": 15}'::jsonb, 'immediate', 2);

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Paradigma pemrograman yang memecah suatu masalah menjadi entitas-entitas yang saling berinteraksi, dimana setiap entitas memiliki sifat dan perilaku tersendiri disebut...', '["Pemrograman Prosedural","Pemrograman Terstruktur","Pemrograman Berorientasi Objek","Pemrograman Fungsional","Pemrograman Deklaratif"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Salah satu keuntungan utama menggunakan pendekatan Pemrograman Berorientasi Objek (PBO) dibandingkan prosedural adalah...', '["Program dieksekusi dari atas ke bawah tanpa percabangan","Kode lebih mudah digunakan ulang (reusable) dan dimodifikasi","Tidak membutuhkan penggunaan memori komputer","Menggabungkan semua instruksi ke dalam satu fungsi utama","Menghindari penggunaan variabel secara keseluruhan"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Rancangan atau cetak biru (blueprint) yang mendefinisikan karakteristik umum dari sekumpulan objek yang sejenis disebut...', '["Method","Object","Atribut","Class","Package"]'::jsonb, 3, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Bentuk nyata (instance) dari sebuah cetak biru, yang memiliki nilai data yang spesifik dan menempati memori dalam sistem, dikenal sebagai...', '["Class","Objek","Tipe Data","Algoritma","Fungsi"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Karakteristik, informasi, atau data yang membedakan satu objek dengan objek lainnya dalam kelas yang sama disebut...', '["Behavior","Method","State / Atribut","Action","Event"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Tindakan, operasi, atau perilaku yang dapat dilakukan oleh sebuah objek dalam sistem disebut...', '["Identifier","Atribut","Tipe Data Dasar","Method / Behavior","Parameter"]'::jsonb, 3, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Konsep membungkus data beserta method yang mengoperasikannya ke dalam satu kesatuan, serta menyembunyikan detail internalnya dari dunia luar disebut...', '["Abstraksi","Enkapsulasi","Polimorfisme","Pewarisan","Generalisasi"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Tujuan utama dari penerapan Enkapsulasi (Information Hiding) adalah...', '["Agar program berjalan lebih cepat","Mengurangi jumlah baris kode","Mencegah data diubah secara sembarangan oleh entitas lain","Memungkinkan sebuah kelas memiliki banyak bentuk","Menghapus data yang tidak lagi digunakan"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Mekanisme yang memungkinkan sebuah entitas baru untuk mengambil alih atau mewarisi atribut dan method dari entitas yang sudah ada sebelumnya disebut...', '["Spesialisasi","Polimorfisme","Enkapsulasi","Inheritance (Pewarisan)","Instansiasi"]'::jsonb, 3, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam konsep Pewarisan, kelas yang memberikan warisan sifat dan perilaku disebut sebagai...', '["Subclass / Child Class","Superclass / Parent Class","Abstract Class","Interface","Concrete Class"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Konsep yang memungkinkan satu entitas memiliki banyak bentuk, sehingga perintah yang sama dapat menghasilkan tindakan yang berbeda tergantung pada objek yang menerimanya adalah...', '["Polimorfisme","Pewarisan Berjamak","Enkapsulasi","Generalisasi","Komposisi"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Proses mendefinisikan ulang method yang diturunkan dari superclass di dalam subclass agar sesuai dengan kebutuhan spesifik subclass tersebut dikenal dengan istilah...', '["Overloading","Overriding","Hiding","Binding","Casting"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Konsep PBO yang berfokus pada penyembunyian kerumitan sistem dan hanya menampilkan antarmuka fungsionalitas yang esensial kepada pengguna adalah...', '["Enkapsulasi","Polimorfisme","Abstraksi","Pewarisan","Agregasi"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Hubungan "Has-A" (Memiliki) dimana suatu kelas merupakan bagian dari kelas lain, namun jika kelas utama dihancurkan, kelas bagian tersebut masih tetap bisa eksis/hidup, disebut relasi...', '["Komposisi","Agregasi","Asosiasi","Generalisasi","Spesialisasi"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Hubungan "Has-A" (Memiliki) yang sangat kuat, dimana eksistensi kelas bagian sangat bergantung mutlak pada eksistensi kelas utamanya (jika induk mati, bagian juga musnah), disebut...', '["Komposisi","Agregasi","Asosiasi","Pewarisan","Realisasi"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam perancangan game, developer memisahkan logika pemain, logika musuh, dan logika lingkungan ke dalam entitas yang independen namun saling berkomunikasi. Hal ini menggambarkan prinsip utama dari...', '["Desain Berorientasi Objek","Desain Prosedural Murni","Desain Fungsional Bersyarat","Top-Down Programming","Bottom-Up Tanpa Entitas"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Jika ''Resep Kue'' adalah sebuah Class, maka kue cokelat hasil panggangan yang ada di atas meja dan siap dimakan merupakan analogi dari...', '["Method","Atribut","Object","Identifier","Parameter"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pada sistem perpustakaan, ''Buku'' memiliki ''Judul'', ''Penulis'', dan ''Tahun Terbit''. Ketiga hal tersebut dalam PBO disebut sebagai...', '["Object","Method","Behavior","Atribut","State Transition"]'::jsonb, 3, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Mesin cuci memiliki tombol ''Mulai''. Ketika ditekan, mesin akan mengisi air, memutar tabung, dan membuang air. Pengguna tidak perlu tahu mekanisme elektroniknya. Ini adalah contoh kuat dari penerapan...', '["Polimorfisme","Inheritance","Abstraksi","Konstruktor","Variabel Lokal"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam sistem akademik, atribut ''IPK'' mahasiswa tidak boleh diubah secara manual dari luar kelas. IPK hanya bisa diperbarui melalui sistem perhitungan nilai akhir semester. Prinsip ini adalah bentuk dari...', '["Polimorfisme","Enkapsulasi Ketat","Abstraksi Proses","Pewarisan Berlapis","Asosiasi Kelas"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Entitas ''Akun Bank'' menyediakan method khusus seperti ''cekSaldo()'', ''tarikTunai()'', dan ''setorTunai()''. Method ini digunakan agar objek lain dapat berinteraksi dengan data saldo yang disembunyikan. Method semacam ini dikenal sebagai...', '["Method Overriding","Getter dan Setter (Accessor & Mutator)","Constructor","Destructor","Abstract Method"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Class ''Pegawai'' memiliki atribut ''Nama'' dan ''Gaji''. Class ''Manajer'' dan ''Staf'' mengambil atribut tersebut. Dalam hal ini, ''Pegawai'' bertindak sebagai...', '["Subclass","Object","Superclass","Interface","Package"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Hewan memiliki method ''makan()''. Kucing mengimplementasikan ''makan()'' dengan memakan ikan, sedangkan Sapi mengimplementasikan ''makan()'' dengan memakan rumput. Konsep PBO apa yang sedang ditunjukkan?', '["Enkapsulasi Data","Pewarisan Berantai","Polimorfisme (Overriding)","Abstraksi Sederhana","Instansiasi Objek"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah aplikasi memiliki method ''Cari(Nama)'' dan method ''Cari(NoHP)''. Meskipun namanya sama, sistem tahu mana yang harus dijalankan berdasarkan data yang dimasukkan pengguna. Ini adalah contoh dari Polimorfisme jenis...', '["Overriding","Overloading","Casting","Binding","Hiding"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pada aplikasi pengiriman pesan, terdapat kelas ''KoneksiJaringan'' yang mendefinisikan metode ''KirimData()'', namun tidak ada implementasinya sama sekali (kosong). Kelas lain yang memakainya WAJIB menjabarkan metode tersebut. Kelas ''KoneksiJaringan'' tersebut bertindak sebagai...', '["Abstract Class / Interface","Concrete Class","Object","Final Class","Sealed Class"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Hubungan antara ''Dosen'' dan ''Mahasiswa'' dimana seorang Dosen mengajar banyak Mahasiswa, dan mereka saling berinteraksi secara independen tanpa bergantung eksistensi hidup-mati, disebut relasi...', '["Komposisi","Agregasi","Asosiasi","Pewarisan","Generalisasi"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, '''Laboratorium Komputer'' memiliki banyak ''Komputer''. Jika Laboratorium dibongkar, Komputer-komputer tersebut masih utuh dan bisa dipindah ke ruangan lain. Hubungan ini paling tepat disebut...', '["Komposisi","Agregasi","Spesialisasi","Pewarisan","Interface"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah ''Gedung'' memiliki ''Pondasi''. Jika Gedung dihancurkan rata dengan tanah, maka Pondasinya pun ikut hancur. Hubungan antara Gedung dan Pondasi adalah contoh relasi...', '["Asosiasi","Agregasi","Komposisi","Polimorfisme","Generalisasi"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Karyawan A mengirimkan permohonan cuti kepada Manajer B. Dalam terminologi PBO, komunikasi atau pemanggilan method dari Objek A ke Objek B ini disebut dengan...', '["Object Instantiation","Message Passing (Pengiriman Pesan)","Data Binding","Encapsulation Flow","Dynamic Polymorphism"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pada sistem E-Commerce, kelas ''Pembayaran'' memiliki atribut ''nominal''. Kelas ''KartuKredit'' mewarisi dari ''Pembayaran''. Manakah pernyataan yang benar?', '["KartuKredit tidak memiliki atribut nominal","Pembayaran kehilangan atribut nominal setelah diwariskan","KartuKredit otomatis memiliki atribut nominal","Atribut nominal pada KartuKredit tidak bisa diubah nilainya","KartuKredit harus menghapus kelas Pembayaran terlebih dahulu"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Jika Anda merancang sistem e-commerce berskala besar, memisahkan fungsionalitas ''Keranjang Belanja'', ''Manajemen Pengguna'', dan ''Proses Pembayaran'' ke dalam class yang berbeda-beda akan memberikan manfaat utama berupa...', '["Peningkatan kecepatan koneksi internet pengguna","Reusability, modularitas tinggi, dan kemudahan dalam melakukan maintenance atau debugging","Penurunan ukuran file database secara signifikan","Menghilangkan kebutuhan akan proses testing perangkat lunak","Memungkinkan program dijalankan tanpa sistem operasi"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam merancang kelas ''AkunBank'', seorang programmer menjadikan atribut ''Saldo'' bersifat publik (dapat diakses langsung). Risiko arsitektural terbesar dari kesalahan desain ini adalah...', '["Program tidak akan bisa di-compile sama sekali","Kelas ''''AkunBank'''' tidak bisa lagi diwariskan ke kelas lain","Integritas data terancam karena saldo bisa dimanipulasi secara ilegal oleh bagian sistem lain melewati logika validasi transaksi","Method-method di dalam kelas tersebut akan berjalan sangat lambat","Objek ''''AkunBank'''' tidak dapat diinstansiasi lebih dari satu kali"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Anda memiliki class ''BentukGeometri'' dan class turunannya: ''Lingkaran'' dan ''Persegi''. Dalam program utama, Anda mengumpulkan semua objek tersebut ke dalam sebuah array bertipe ''BentukGeometri''. Ketika Anda melakukan perulangan dan memanggil fungsi ''hitungLuas()'' pada tiap elemen, sistem secara dinamis memanggil rumus yang tepat untuk masing-masing bentuk. Fenomena arsitektur ini disebut...', '["Static Binding","Dynamic Method Dispatch / Virtual Method Invocation (Polimorfisme)","Strict Encapsulation","Abstract Inheritance","Composition over Inheritance"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Manakah dari skenario perancangan hierarki Pewarisan (Inheritance) berikut yang melanggar prinsip "Liskov Substitution Principle" (Subclass harus bisa menggantikan Superclass sepenuhnya)?', '["Class ''''Bebek'''' diwariskan dari class ''''Burung'''', di mana keduanya memiliki method terbang()","Class ''''MobilSport'''' diwariskan dari class ''''KendaraanRodaEmpat''''","Class ''''BujurSangkar'''' diwariskan dari class ''''PersegiPanjang'''', namun memaksakan panjang harus selalu sama dengan lebar sehingga merusak perilaku PersegiPanjang yang bebas","Class ''''KaryawanTetap'''' diwariskan dari class ''''Karyawan''''","Class ''''RekeningGiro'''' diwariskan dari class ''''RekeningBank''''"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Saat merancang aplikasi Smart Home, Anda ingin memastikan bahwa BENTUK APAPUN dari perangkat pintar di masa depan (misal: Lampu, AC, MesinKopi) WAJIB memiliki fungsi ''hidupkan()'' dan ''matikan()''. Pendekatan desain PBO yang paling kokoh untuk memaksakan kontrak ini adalah...', '["Menggunakan Concrete Class sebagai induk dengan implementasi penuh","Menggunakan pola Relasi Asosiasi Ganda","Menggunakan Interface atau Class Abstract yang murni mendefinisikan kontrak tanpa implementasi detail","Menerapkan Enkapsulasi tingkat tinggi pada semua atribut perangkat","Menghindari Pewarisan dan menggunakan method Overloading di program utama"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam perancangan pemodelan Manusia, atribut ''Jantung'' didefinisikan di dalam konstruktor kelas ''Manusia''. Jika objek ''Manusia'' dihapus dari memori, objek ''Jantung'' secara otomatis ikut dihancurkan. Keputusan arsitektural ini mencerminkan relasi...', '["Asosiasi Bebas","Agregasi Relasional","Spesialisasi Berantai","Komposisi Kuat (Strong Composition)","Polimorfisme Statis"]'::jsonb, 3, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Developer A merancang kelas ''Pesawat'' yang mewarisi sifat dari kelas ''Burung'' hanya karena keduanya bisa terbang. Menurut prinsip analisis PBO yang baik, perancangan ini adalah...', '["Sangat efisien karena menghemat kode","Kurang tepat, karena secara konseptual Pesawat BUKANLAH sejenis Burung (melanggar relasi \"Is-A\")","Diperbolehkan asalkan menggunakan Polimorfisme","Wajib dilakukan untuk meningkatkan abstraksi","Tepat, karena PBO tidak memperdulikan logika dunia nyata"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah sistem pemesanan makanan mendefinisikan kelas ''Pesanan''. Atribut ''StatusPesanan'' tidak boleh diubah kecuali urutannya: Dibuat \-\> Diproses \-\> Dikirim \-\> Selesai. Cara terbaik mengimplementasikan logika ini dalam PBO adalah...', '["Menjadikan atribut StatusPesanan publik agar mudah diubah kapan saja","Menyembunyikan atribut (private) dan membuat method seperti prosesPesanan(), kirimPesanan() yang memiliki logika validasi internal (Enkapsulasi flow)","Menghapus kelas Pesanan dan memasukkan logikanya ke database","Menggunakan overloading pada method pembuat pesanan","Menjadikan kelas Pesanan sebagai Abstract Class"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Terdapat konsep ''Diamond Problem'' dalam PBO (dimana bahasa seperti Java mencegahnya dengan melarang Multiple Inheritance pada class). Konsep ini terjadi jika...', '["Sebuah kelas tidak memiliki superclass sama sekali","Sebuah kelas mewarisi dari dua atau lebih kelas induk yang memiliki method dengan nama sama, sehingga timbul ambiguitas method mana yang dipakai","Sebuah kelas memiliki jumlah atribut yang terlalu banyak","Objek dari sebuah kelas diinisiasi menggunakan pola berlian (diamond operator)","Sistem mendeteksi adanya method tanpa tipe kembalian"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pola arsitektur Model-View-Controller (MVC) sangat erat kaitannya dengan PBO. Dalam pola ini, kelas yang bertanggung jawab penuh terhadap manipulasi logika data dan validasi aturan bisnis diletakkan pada bagian...', '["Controller","View","Model","Database Routing","User Interface Layout"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pada sistem pengelolaan Universitas, seorang ''Mahasiswa'' mendaftar di banyak ''Mata Kuliah'', dan satu ''Mata Kuliah'' diikuti oleh banyak ''Mahasiswa''. Untuk memecahkan kompleksitas pemodelan "Banyak-ke-Banyak" (Many-to-Many) ini dalam PBO, solusi desain yang paling umum adalah...', '["Mewariskan Kelas Mahasiswa ke Mata Kuliah","Membuat relasi Komposisi yang saling mematikan","Membuat sebuah kelas baru (misal: ''''KRS'''' atau ''''Registrasi'''') sebagai kelas penengah (Association Class)","Menjadikan Mahasiswa dan Mata Kuliah sebagai Interface","Menghapus salah satu kelas untuk menyederhanakan sistem"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Seorang analis sistem berargumen: "Daripada membuat class ''KaryawanHarian'' dan ''KaryawanBulanan'' yang mewarisi class ''Karyawan'', lebih fleksibel jika class ''Karyawan'' memiliki atribut objek ''TipePembayaran''." Pergeseran pandangan desain dari Pewarisan menjadi memiliki atribut objek ini dikenal dengan prinsip...', '["Polymorphism over Inheritance","Encapsulation over Abstraction","Composition over Inheritance (Lebih mengutamakan Komposisi dibanding Pewarisan)","Overriding over Overloading","Top-Down over Bottom-Up"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam konsep Pemrograman Berorientasi Objek, apabila suatu Class dirancang agar sama sekali TIDAK BISA diwariskan ke Class lain demi alasan keamanan atau integritas struktur logikanya, maka secara konseptual Class tersebut bersifat...', '["Abstrak (Abstract)","Tersegel / Final (Sealed / Final)","Publik Mutlak","Antarmuka (Interface)","Generik (Generic)"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Saat merancang class ''Kendaraan'', Anda meletakkan logika validasi "Nomor Polisi harus format standar" langsung di dalam fungsi ''setter'' atribut Nomor Polisi. Ini memastikan bahwa...', '["Tidak ada objek Kendaraan yang memiliki Nomor Polisi tidak valid selama program berjalan (Integritas Objek via Enkapsulasi)","Program akan berjalan lebih cepat dibanding tanpa validasi","Class Kendaraan tidak dapat diturunkan ke kelas lain","Memori yang digunakan akan berkurang drastis","Nomor polisi tersebut dapat langsung mencetak dirinya sendiri ke layar"]'::jsonb, 0, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam PBO tingkat lanjut, penggunaan Dependency Injection (menyuntikkan objek ke dalam kelas melalui konstruktor) digunakan untuk...', '["Membuat ketergantungan antar kelas menjadi sangat kuat dan tidak bisa diubah (Tight Coupling)","Mengurangi keterkaitan yang kaku antar kelas (Loose Coupling) sehingga kelas lebih mudah dites dan dipelihara","Menghancurkan objek yang sudah tidak terpakai","Meningkatkan keamanan data dengan menyembunyikan atribut","Menghentikan pewarisan (Inheritance) secara total dalam proyek"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sifat atau keadaan dari sebuah objek yang merepresentasikan nilainya pada suatu saat tertentu disebut...', '["Behavior","Identity","State / Kondisi","Method","Event"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Kemampuan untuk membuat kelas baru yang secara otomatis mempertahankan karakteristik dari kelas yang sudah ada disebut...', '["Polymorphism","Inheritance (Pewarisan)","Encapsulation","Abstraction","Composition"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sekumpulan objek yang memiliki atribut, perilaku, dan relasi yang serupa dikelompokkan dalam satu entitas konseptual yang dinamakan...', '["Package","Array","Class","Method","Variable"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Proses menyembunyikan detail implementasi rumit dari suatu sistem dan hanya menampilkan fungsionalitas utamanya kepada pengguna disebut...', '["Encapsulation","Abstraction","Polymorphism","Inheritance","Overloading"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Relasi berjenis "Is-A" (Adalah Sebuah) dalam pemodelan PBO paling tepat merujuk pada konsep...', '["Asosiasi","Agregasi","Komposisi","Pewarisan (Inheritance)","Enkapsulasi"]'::jsonb, 3, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam PBO, fungsi, prosedur, atau rutin yang melekat pada sebuah kelas dan mendefinisikan apa yang bisa dilakukan oleh objek disebut...', '["Atribut","Objek","Method","Variabel","Parameter"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Penggunaan dua atau lebih metode dengan nama yang sama di dalam satu kelas, asalkan memiliki parameter (signature) yang berbeda, disebut...', '["Overriding","Overloading","Polymorphism Dinamis","Encapsulation","Inheritance"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Modifier (pembatas) hak akses yang memastikan suatu atribut atau metode HANYA DAPAT diakses oleh kelas itu sendiri adalah...', '["Public","Private","Protected","Default","Global"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Relasi mendasar antar kelas di mana satu kelas menggunakan fungsionalitas kelas lain secara independen, tanpa ikatan siklus hidup yang kuat, dinamakan...', '["Asosiasi","Komposisi","Pewarisan","Abstraksi","Enkapsulasi"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Ketika sebuah objek dari kelas turunan (subclass) diolah atau diperlakukan seolah-olah ia adalah objek dari kelas induknya (superclass), sistem ini menerapkan prinsip...', '["Encapsulation","Abstraction","Polymorphism","Instantiation","Aggregation"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam rancangan kelas ''Mobil'', entitas seperti ''warna'', ''merk'', dan ''kecepatanMaksimal'' dikategorikan sebagai...', '["Method","Behavior","Atribut","Class","Object"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sedangkan entitas seperti ''hidupkanMesin()'', ''tambahKecepatan()'', dan ''rem()'' dalam kelas ''Mobil'' dikategorikan sebagai...', '["Atribut","Method","Class","State","Objek"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Manakah dari daftar berikut ini yang BUKAN merupakan prinsip/pilar dasar dari Pemrograman Berorientasi Objek?', '["Encapsulation","Inheritance","Polymorphism","Compilation","Abstraction"]'::jsonb, 3, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Fungsi khusus di dalam sebuah kelas yang bertugas mempersiapkan memori dan secara otomatis dijalankan setiap kali sebuah objek baru diciptakan disebut...', '["Destructor","Setter","Getter","Constructor (Konstruktor)","Overrider"]'::jsonb, 3, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Memberikan nilai default/awal pada atribut saat sebuah objek pertama kali "lahir" ke dalam sistem adalah tanggung jawab utama dari fitur PBO berupa...', '["Konstruktor","Enkapsulasi","Pewarisan","Polimorfisme","Garbage Collector"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Analogi: Jika ''Cetakan Kue'' adalah sebuah Class, dan ''Kue Bolu'' adalah Objek, maka rasa cokelat atau ukuran diameter 20cm pada kue tersebut melambangkan...', '["Method","Behavior","Atribut","Constructor","Abstraction"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pada aplikasi HRD, atribut ''gajiPegawai'' diberi hak akses Private. Nilainya hanya bisa diakses menggunakan metode khusus getGaji(). Tujuan utama arsitektur ini adalah...', '["Meningkatkan kecepatan eksekusi program","Menghindari duplikasi kode","Melindungi integritas data gaji dari manipulasi sembarangan pihak luar (Enkapsulasi)","Memungkinkan perhitungan komputasi cloud","Menerapkan pewarisan ganda"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Class ''Unggas'' memiliki method ''bergerak()''. Class ''Burung'' (turunan Unggas) memodifikasi method tersebut menjadi ''terbang()'', sedangkan ''Ayam'' (turunan Unggas) memodifikasinya menjadi ''berjalan()''. Proses mendefinisikan ulang method ini disebut...', '["Method Overloading","Method Overriding","Object Instantiation","Data Abstraction","Structural Composition"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Anda mendesain kelas ''Perpustakaan'' yang memuat banyak ''Buku''. Jika ''Perpustakaan'' ditutup/dibongkar, fisik ''Buku'' tersebut tetap utuh dan bisa dipindahkan ke perpustakaan lain. Dalam UML, relasi ini dikenal sebagai...', '["Komposisi","Agregasi","Generalisasi","Spesialisasi","Pewarisan"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebaliknya, Anda merancang kelas ''Manusia'' dan ''Jantung''. Jantung dikonstruksi bersamaan dengan manusia. Jika manusia tersebut wafat/hancur, jantung tersebut juga berhenti eksis sebagai organ fungsional. Relasi yang mengikat mutlak ini adalah...', '["Komposisi","Agregasi","Asosiasi Bebas","Generalisasi","Polymorphism"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sistem kasir toko menyediakan dua fungsi diskon. Fungsi pertama: hitungDiskon(NamaPelanggan). Fungsi kedua: hitungDiskon(NamaPelanggan, KartuMember). Sistem tidak bingung karena mengenali beda jumlah parameternya. Ini adalah bentuk penerapan...', '["Method Overriding","Method Overloading","Secure Encapsulation","Abstract Logic","Inheritance Link"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam sistem kampus, class ''Dosen'' dan ''Mahasiswa'' memiliki kesamaan atribut seperti ''Nama'', ''Alamat'', dan ''NoTelp''. Untuk mencegah kode ditulis berulang-ulang, desain PBO yang efisien adalah...', '["Membuat sebuah class ''''CivitasAkademika'''' (atau ''''Person'''') sebagai Superclass bagi keduanya","Menyatukan dosen dan mahasiswa secara paksa di dalam satu class","Membuat Dosen menjadi subclass dari Mahasiswa","Menerapkan Enkapsulasi penuh tanpa Pewarisan","Mematikan fitur atribut pada kedua kelas"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Satu tombol ''Play'' pada sistem home theater bisa memutar kaset, membaca CD, atau menyetel Bluetooth MP3. Sistem di dalamnya menavigasi perilaku perangkat baca yang tepat secara otomatis. Prinsip PBO ini merupakan implementasi sejati dari...', '["Inheritance","Encapsulation","Polymorphism","Static Typed","Constructor Default"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pada game catur, class ''BidakCatur'' memiliki metode ''bergerak()''. Namun BidakCatur hanyalah konsep, tidak ada bidak nyata yang bernama murni "BidakCatur" (semua bidak adalah Pion, Kuda, dll). Secara perancangan PBO, metode ''bergerak()'' di kelas induk harus dibuat sebagai...', '["Concrete Method","Abstract Method","Final Method","Private Method","Overloaded Method"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah kucing adalah sejenis hewan (Kucing Is-A Hewan). Jika dalam sistem referensi variabel bertipe ''Hewan'' menunjuk pada objek ''Kucing'' di memori, kita sedang memanfaatkan kemampuan PBO yaitu...', '["Enkapsulasi State","Polimorfisme (Upcasting)","Data Hiding","Asosiasi","Agregasi Parsial"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Jika Anda merancang kelas ''Lingkaran'', secara rasional matematis atribut ''jari\_jari'' tidak boleh bernilai negatif. Validasi pencegahan angka negatif paling tepat ditempatkan pada...', '["Superclass Lingkaran","Method Getter","Method Setter / Konstruktor","Abstract Class","Interface Publik"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Saat mengemudikan mobil, Anda cukup menginjak pedal rem dan laju mobil melambat. Anda tidak tahu dan tidak perlu tahu perhitungan gesekan kampas rem di dalam ban. Filosofi desain "sembunyikan cara kerjanya, tampilkan cara pakainya" ini adalah wujud nyata dari...', '["Polimorfisme Dinamis","Abstraksi Fungsional","Pewarisan Berjamak","Relasi Agregasi","Overloading Parametrik"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Mobil dirangkai dari Bodi, Mesin, dan Roda. Hubungan konseptual yang menyatakan "Mobil memiliki Roda" (Mobil Has-A Roda) di dalam pemodelan PBO mewakili ikatan...', '["Generalisasi","Relasi Asosiasi / Agregasi / Komposisi","Spesialisasi","Pewarisan Berjamak","Polimorfisme Dinamis"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Mesin ATM tidak membiarkan Anda mengakses tabel database secara mandiri. Ia menengahi transaksi menggunakan layar antarmuka TarikDana(). Dalam konsep OOP, ini adalah bentuk praktis penerapan...', '["Enkapsulasi","Polimorfisme","Pewarisan Terbuka","Overloading Instans","Abstraksi Murni"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam ilmu biologi, ''Penguin'' diwarisi dari famili ''Burung''. Tapi jika kelas ''Burung'' memiliki fungsionalitas baku ''bisa\_terbang()'', mewariskan kelas ''Burung'' ke kelas ''Penguin'' dalam sistem perangkat lunak akan mengakibatkan...', '["Penguin otomatis bisa terbang tanpa error","Kecacatan logika sistem karena memaksakan sifat yang tidak wajar (melanggar model desain dunia nyata yang spesifik)","Sistem menjadi hemat memori","Polimorfisme bekerja lebih maksimal","Kode menjadi sangat ringkas"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam metodologi arsitektur sistem berskala besar berbasis PBO, memisahkan logika tata letak tampilan (GUI) dari manipulasi algoritma basis data diimplementasikan secara efisien melalui design pattern (pola desain) standar industri yaitu...', '["Singleton Pattern","Model-View-Controller (MVC) Pattern","Observer Pattern","Decorator Pattern","Factory Pattern"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Beberapa bahasa pemrograman PBO modern dengan ketat melarang konsep Multiple Inheritance (satu kelas anak mewarisi atribut dua kelas induk sekaligus). Alasan arsitektural di balik larangan ini adalah...', '["Terlalu banyak menggunakan RAM komputer klien","Untuk menghindari \"Diamond Problem\", yakni kebingungan kompilator saat dua kelas induk memiliki nama metode identik","Mencegah penggunaan variabel statis","Menghapus fungsionalitas dari Konstruktor asli","Membatasi fleksibilitas programmer secara disengaja"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebagai jalan tengah untuk menghindari Multiple Inheritance, PBO menyediakan fitur agar sebuah class dapat "menandatangani kontrak" untuk mematuhi banyak standar metode terstruktur melalui penggunaan...', '["Abstract Superclass","Antarmuka (Interface)","Polimorfisme Rekursif","Variabel Dinamis","Concrete Composition"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam perangkat lunak pemesanan tiket penerbangan multithread (banyak pelanggan memesan bersamaan), atribut ''sisaKursi'' dibungkus rapat-rapat dan pengurangannya hanya dapat dilakukan satu per satu via metode terkontrol. Landasan pengamanan arsitektur ini berdiri di atas prinsip...', '["Abstraksi Visual","Generalisasi Penuh","Enkapsulasi / Penyembunyian Data Tingkat Lanjut","Agregasi Relasional","Polimorfisme Berlapis"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Prinsip arsitektur PBO yang terkenal, "Composition over Inheritance" (Lebih memprioritaskan Komposisi dibanding Pewarisan) berargumen bahwa...', '["Pewarisan tidak berguna dan harus dihapus","Lebih menguntungkan membangun fitur dengan merangkai kelas-kelas independen seperti blok lego, daripada menciptakan silsilah keluarga (inheritance) hierarkis yang kaku dan rentan patah","Pewarisan selalu memicu sistem error secara runtime","Atribut public selalu lebih aman daripada atribut protected","Metode Overloading hanya bisa dicapai melalui komposisi mutlak"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Jika Anda memiliki array kumpulan ''Pegawai'', yang berisi ''Manajer'', ''Staf'', dan ''Direktur''. Anda melakukan iterasi/looping dan memanggil perintah ''hitungBonus()''. Sistem otomatis memberikan 50% untuk Direktur dan 10% untuk Staf di saat runtime (saat aplikasi jalan). Kecerdasan mesin mengenali tipe objek aslinya ini ditangani oleh fitur...', '["Static Binding","Dynamic Method Dispatch (Virtual Method Invocation) / Late Binding","Encapsulation Parsing","Structural Abstraction","Composition Linkage"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam pembuatan game engine, class inti ''GameObject'' memiliki deklarasi ''render()'' abstrak. Segala elemen di layar (Peluru, Karakter, Pohon) wajib mewarisi GameObject dan wajib menjabarkan cara ''render()'' mereka sendiri. Manfaat masif dari desain struktural ini adalah...', '["Game engine tidak perlu menyeleksi objek menggunakan logika IF/ELSE yang panjang, cukup memanggil ''''render()'''' polimorfik secara merata","Peluru bisa mengubah tipenya menjadi pohon secara dinamis","Memori grafis tidak terpakai sama sekali","Metode render tidak perlu ditulis di anak kelas","Mengurangi kecepatan eksekusi logika game"]'::jsonb, 0, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah class inti penyandi password (EncryptionService) dikunci secara arsitektural menggunakan modifier Final (atau Sealed) sehingga ia tidak bisa dijadikan Superclass sama sekali. Apa justifikasi logis untuk mengunci class ini?', '["Agar proses enkripsi berjalan sangat cepat menembus perangkat keras","Mencegah programmer lain membuat subclass yang sengaja ''''merusak'''' atau membocorkan mekanisme algoritma enkripsi internal demi keamanan tinggi","Supaya class tersebut bisa menjadi interface ganda","Meringankan beban kompilator bahasa","Mengizinkan class tersebut dihapus saat runtime"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pada pemodelan hubungan "Rumah Sakit" dan "Dokter" (Agregasi) dibandingkan "Rumah Sakit" dan "Ruang UGD" (Komposisi). Perbedaan utama penulisan abstraksinya dalam desain arsitektur Object Oriented terletak pada...', '["Jumlah parameter di setiap metode","Dependensi siklus hidup (Lifecycle Dependency): di komposisi, \"Ruang UGD\" harus dimusnahkan jika \"Rumah Sakit\" dihancurkan; sementara \"Dokter\" akan tetap eksis meski rumah sakitnya tutup","Penggunaan method overriding","Kemampuan enkapsulasi objek turunan","Keberadaan atribut publik"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Developer merancang kelas ''Persegi'' yang mewarisi sifat ''PersegiPanjang''. Masalah muncul jika di program utama (Main), method bawaan mengubah ''lebar'' persegi tersebut tanpa mengubah ''panjang'', mematahkan kaidah geometri persegi secara tak sengaja. Kesalahan pewarisan logika PBO ini adalah pelanggaran terhadap...', '["Liskov Substitution Principle (LSP)","Interface Segregation Principle (ISP)","Single Responsibility Principle (SRP)","Dependency Inversion Principle (DIP)","Open/Closed Principle (OCP)"]'::jsonb, 0, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Salah satu kekuatan Polimorfisme adalah membuat aplikasi ''Scalable'' (Mudah Berkembang). Ini dapat tercapai utamanya karena...', '["Penambahan objek turunan baru di masa depan tidak mengharuskan developer mengubah ulang logika pemanggil inti yang bergantung pada kelas induknya","Aplikasi bisa dirubah menjadi prosedur struktural sewaktu-waktu","Fitur kompresi kode bekerja maksimal memperkecil file instalasi","Mengurangi penggunaan memori pada perangkat berspesifikasi rendah","Semua error dapat diperbaiki sendiri oleh compiler"]'::jsonb, 0, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Class Diagram pada dokumen perancangan menunjukkan "Relasi Asosiasi Ganda" (Bidirectional Association) antara ''Pembeli'' dan ''Toko''. Translasi yang tepat ke logika PBO adalah...', '["Keduanya disatukan secara paksa ke satu entitas mega-class","Pembeli menyimpan referensi ke Toko, dan Toko menyimpan referensi koleksi Pembeli, keduanya saling tahu satu sama lain","Pembeli mewarisi dari Toko","Toko mewarisi sifat Pembeli","Pembeli hanya menggunakan Toko sebagai variabel lokal sesaat"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Seorang arsitek software mendesain fungsi pembuat laporan \*cetak()\*. Daripada memusingkan rekan setimnya dengan puluhan nama seperti \*cetakKePDF()\*, \*cetakKeWord()\*, \*cetakKeExcel()\*, ia menggunakan \*cetak(PDF)\*, \*cetak(Word)\*. Pendekatan menyatukan nama logika fungsional ini difasilitasi oleh...', '["Abstraksi Struktural Bebas","Polimorfisme Statis / Method Overloading","Overriding Instans","Enkapsulasi Flow","Komposisi Tingkat Dasar"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Perbedaan paling substansial dalam perancangan sistem antara Abstract Class dan Interface adalah...', '["Interface di PBO modern boleh memiliki nilai atribut yang berubah-ubah","Interface mendefinisikan murni \"Kontrak Kemampuan\" (Apa yang bisa dilakukannya), sedangkan Abstract Class mendefinisikan \"Identitas Inti\" (Siapa dia sebenarnya) plus membagikan fungsionalitas turunan utamanya","Abstract class berjalan lebih cepat","Interface tidak mendukung polimorfisme","Abstract class mencegah pewarisan"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam pola desain arsitektur standar industri OOP (Design Patterns), ada kalanya sebuah class koneksi database dikonfigurasi menggunakan struktur Singleton. Artinya class tersebut dirancang untuk...', '["Selalu diwariskan oleh seluruh form GUI","Mengandung constructor dengan akses public total","Memastikan hanya ada MAKSIMAL SATU objek (instance) utuh dari kelas tersebut yang aktif mengatur lalu lintas data selama program berjalan, menghindari tabrakan trafik","Menyembunyikan keseluruhan fungsionalitas database dari sistem pengguna","Memusnahkan dirinya sendiri setelah dipanggil tiga kali"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam PBO, prinsip "Information Hiding" (menyembunyikan informasi internal) merupakan gagasan inti dari konsep...', '["Polimorfisme","Pewarisan","Enkapsulasi","Abstraksi","Asosiasi"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Proses merepresentasikan atau memodelkan entitas dunia nyata ke dalam bentuk cetak biru perangkat lunak dengan hanya mengambil fitur-fitur yang esensial disebut...', '["Enkapsulasi","Abstraksi","Polimorfisme","Komposisi","Instansiasi"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Di dalam pemodelan visual seperti UML (Unified Modeling Language), relasi ''Pewarisan'' (Inheritance) umumnya digambarkan menggunakan simbol...', '["Panah putus-putus","Garis dengan bidang belah ketupat hitam","Garis dengan bidang belah ketupat putih","Garis lurus biasa","Garis berujung panah dengan segitiga kosong/putih"]'::jsonb, 4, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Hubungan struktural di mana dua kelas saling terhubung, saling berkomunikasi, dan saling menggunakan fungsi satu sama lain tanpa ketergantungan hidup-mati disebut relasi...', '["Asosiasi","Pewarisan","Spesialisasi","Komposisi","Enkapsulasi"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Entitas utama pada program berorientasi objek yang menampung data (state) sekaligus fungsi untuk memanipulasi data tersebut dinamakan...', '["Variabel","Method","Objek","Array","Pointer"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Untuk mengubah nilai suatu atribut yang bersifat tersembunyi (private), praktik terbaik (best practice) dalam PBO adalah menggunakan...', '["Method Getter","Method Setter","Konstruktor Abstrak","Variabel Global","Modifier Public secara langsung"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebaliknya, untuk mengambil atau membaca nilai suatu atribut yang bersifat private, praktik terbaik dalam PBO adalah menggunakan...', '["Method Getter","Method Setter","Polimorfisme","Abstraksi Data","Akses Array"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Karakteristik OOP yang memungkinkan objek-objek yang berbeda dapat merespon perintah (pemanggilan method) yang namanya sama dengan tindakan yang berbeda-beda disebut...', '["Pewarisan","Generalisasi","Abstraksi","Polimorfisme","Enkapsulasi"]'::jsonb, 3, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah kelas yang sengaja dirancang agar TIDAK DAPAT dibuatkan objek nyatanya (tidak dapat diinstansiasi) dan hanya berfungsi sebagai kerangka dasar dinamakan...', '["Kelas Konkret","Kelas Abstrak","Interface Murni","Kelas Final","Kelas Statis"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Atribut/variabel yang kepemilikannya bukan pada objek individual, melainkan dimiliki bersama oleh satu kelas itu sendiri secara utuh, disebut sebagai variabel...', '["Lokal","Instans","Statis (Class Variable)","Dinamis","Konstruktor"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah deklarasi metode di dalam kelas yang hanya memiliki nama fungsi tanpa memiliki body (isi implementasi) sama sekali dinamakan...', '["Method Abstrak","Method Overloading","Method Final","Method Private","Method Konstruktor"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Prinsip dalam OOP yang menyatakan bahwa kelas anak (subclass) harus mewarisi dan dapat memiliki seluruh fungsionalitas dari kelas induknya (superclass) adalah...', '["Agregasi","Komposisi","Pewarisan (Inheritance)","Abstraksi","Interface"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Manakah istilah yang merujuk pada penulisan beberapa fungsi dengan nama yang persis sama di dalam SATU kelas, namun dibedakan berdasarkan jumlah atau tipe parameternya?', '["Method Overriding","Method Overloading","Method Hiding","Method Abstracting","Method Invoking"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Manakah istilah yang merujuk pada penulisan ulang/penggantian implementasi fungsi yang berasal dari superclass ke dalam subclass-nya?', '["Method Overriding","Method Overloading","Method Calling","Method Setting","Method Overlapping"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam pemahaman objek, kondisi internal (state) dari suatu objek pada waktu tertentu ditentukan sepenuhnya oleh...', '["Nama dari metode yang dimilikinya","Kelas induk yang menurunkannya","Nilai-nilai yang tersimpan di dalam atribut-atributnya","Letak objek di dalam memori komputer","Relasinya dengan objek antarmuka"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pada game RPG, karakter Penyihir dan Ksatria diwarisi dari class Karakter. Keduanya memiliki fungsi ''serang()''. Penyihir menembakkan bola api, Ksatria mengayunkan pedang. Fenomena fungsionalitas ini adalah contoh nyata dari penerapan...', '["Polimorfisme","Enkapsulasi","Abstraksi Dinamis","Relasi Asosiasi","Agregasi Parsial"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Saat merancang aplikasi perbankan, atribut ''saldo'' diatur agar disembunyikan dan hanya bisa diakses via metode \`setor()\` dan \`tarik()\`. Hal ini mencerminkan prinsip arsitektur...', '["Generalisasi Pewarisan","Enkapsulasi / Information Hiding","Polimorfisme Statis","Class Abstraction","Object Destruction"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Seorang ''Dosen'' memiliki sekumpulan objek ''Mahasiswa'' Bimbingan. Dosen tersebut bisa saja pensiun, tetapi Mahasiswa tetap bisa dibimbing oleh dosen lain (keduanya tetap utuh hidup). Ini adalah bentuk relasi...', '["Komposisi","Agregasi","Pewarisan","Instansiasi","Spesialisasi"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sistem memproses entitas ''Bentuk'' pada layar. Namun, program tidak pernah membuat objek nyata dari ''Bentuk'', melainkan langsung membuat ''Segitiga'' atau ''Lingkaran''. Secara konsep struktural, kelas ''Bentuk'' difungsikan sebagai...', '["Kelas Instans (Concrete Class)","Kelas Abstrak (Abstract Class)","Kelas Final (Sealed Class)","Kelas Anak (Subclass)","Kelas Statis (Static Class)"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam kelas ''Mobil'', fungsi \`nyalakanMesin()\` dapat dipanggil menggunakan parameter input berupa objek (KunciFisik), ATAU dapat dipanggil menggunakan parameter (KodeDigital). Penerapan pemanggilan fleksibel ini terjadi karena teknik...', '["Method Overriding","Method Overloading","Data Hiding","Polimorfisme Objek","Class Composition"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah ''Sistem Akuntansi'' memerlukan algoritma kompleks perhitungan pajak bulanan. Fungsi perhitungan ini diletakkan tertutup dalam kelas khusus tanpa bisa dipanggil oleh komponen antarmuka layar pengguna secara mandiri. Konsep yang diterapkan adalah...', '["Enkapsulasi Proses / Black Box","Pewarisan Berjamak","Polimorfisme Dinamis","Konstruktor Bebas","Agregasi Bebas"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Buku memiliki banyak Halaman. Jika fisik Buku dibakar, maka seluruh Halaman di dalamnya dipastikan ikut musnah. Dalam PBO, relasi ini paling cocok diimplementasikan menggunakan konsep...', '["Agregasi","Asosiasi Bebas","Komposisi","Pewarisan Rantai","Generalisasi"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Karyawan merupakan superclass. Manager mewarisi Karyawan. Jika kita membuat array khusus bertipe data Karyawan, namun kita memasukkan objek Manager ke dalam slot array tersebut, kemampuan sistem menoleransi hal ini disebut...', '["Polimorfisme Upcasting","Polimorfisme Downcasting","Enkapsulasi Konstruktor","Abstraksi Tingkat Rendah","Multiple Inheritance"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Jika metode standar \`bernafas()\` di kelas Mamalia ditulis ulang logikanya di kelas Paus agar sesuai dengan mekanisme cara paus bernafas (harus muncul ke permukaan air), teknik ini dinamakan...', '["Method Hiding","Method Calling","Method Overloading","Method Overriding","Method Abstrak"]'::jsonb, 3, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Objek ''RemoteAC'' memiliki tombol pengatur suhu. Pengguna hanya menekan tombol tanpa perlu tahu rumitnya sirkuit kelistrikan pemancar sinyal infra-merah di dalamnya. Ini menunjukkan prinsip kemudahan penggunaan OOP yang disebut...', '["Pewarisan (Inheritance)","Abstraksi (Abstraction)","Asosiasi (Association)","Konstruksi Objek (Construction)","Setter Statis"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Anda membuat kelas konseptual Kendaraan dengan metode abstrak bergerak(). Anda tidak bisa menggunakan syntax pembuatan objek "New Kendaraan()" di memori komputer karena...', '["Memori komputer tidak akan cukup menampung benda abstrak","Kelas abstrak hanya bertindak sebagai cetak biru konseptual tak berwujud bagi turunannya","Method bergerak harus dihapus terlebih dahulu","Kendaraan bersifat final","Kompiler akan bingung menentukan ukurannya"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam sistem manajemen perpustakaan, ''Anggota'' dapat meminjam banyak ''Buku'', dan ''Buku'' dapat dipinjam oleh ''Anggota'' secara bergantian sepanjang tahun. Hubungan struktural yang saling mengenali secara independen ini disebut...', '["Komposisi","Spesialisasi","Asosiasi","Generalisasi","Enkapsulasi"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Apa yang akan terjadi menurut aturan OOP jika sebuah kelas turunan (subclass) mencoba mengambil dan mengubah atribut yang diset ''private'' dari kelas induknya secara brutal tanpa menggunakan metode perantara getter/setter?', '["Atribut akan otomatis berubah menjadi publik","Subclass tersebut otomatis memutus ikatan pewarisan","Terjadi pelanggaran hak akses (Akses ditolak / Error)","Sistem akan membiarkannya demi polimorfisme","Nilai atribut akan terhapus"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Ketika menganalisa sistem, Anda menemukan entitas Pelanggan dan Pemasok sama-sama memiliki atribut ''Nama'', ''Alamat'', dan ''No\_Telp''. Langkah refactoring OOP paling optimal adalah...', '["Menyatukan Pemasok dan Pelanggan menjadi satu kelas paksa","Membuat superclass baru (misal: EntitasBisnis) yang memuat atribut tersebut, lalu diwariskan ke keduanya","Menghapus atribut di Pelanggan agar menghemat memori","Membuat Pelanggan menjadi subclass dari Pemasok","Membuat class Pelanggan dan Pemasok menjadi class abstrak"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Anda membuat metode \`hitungGaji()\` tanpa implementasi (kosong) di dalam Antarmuka (Interface) Pegawai. Antarmuka tersebut kemudian diimplementasikan oleh kelas PegawaiTetap dan PegawaiKontrak. Manfaat utamanya adalah...', '["Menjamin sistem bisa menghapus kelas pegawai dengan mudah","Menjamin bahwa apapun jenis pegawainya kelak, PASTI memiliki kemampuan untuk menghitung gaji (Kontrak standar)","Membuat kelas pegawai menjadi error","Mengurangi kebutuhan memori sistem hingga 50%","Mencegah penggunaan constructor"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam dunia rekayasa perangkat lunak modern, para arsitek sering memprioritaskan prinsip "Komposisi dibandingkan Pewarisan" (Composition over Inheritance). Alasan utama kelemahan arsitektur pewarisan yang berantai terlalu dalam adalah...', '["Terlalu memakan banyak kapasitas disk (Storage)","Mengharuskan penggunaan variabel global berlebihan","Menyebabkan masalah ''''Fragile Base Class'''' di mana sistem menjadi kaku dan setiap perubahan kecil di superclass dapat merusak seluruh fungsionalitas subclass di bawahnya secara tidak terduga","Mewajibkan penghapusan fungsi Polimorfisme dari bahasa pemrograman","Kelas induk akan otomatis hancur saat kelas anak dibuat"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam pola arsitektur standar MVC (Model-View-Controller) berorientasi objek, rute aliran data yang paling benar dan aman pada saat seorang pengguna menekan tombol "Simpan Profil" di layar antarmuka adalah...', '["View langsung mengubah isi Model, lalu Controller menampilkan notifikasi","View meneruskan aksi ke Controller, Controller memvalidasi logika, lalu Controller memerintahkan Model untuk mengubah data, Model memberikan status keberhasilan ke Controller","Model mendeteksi tombol dan meng-update Controller","Controller menulis ulang View tanpa mempedulikan Model","View dan Model tidak saling berhubungan, hanya melalui Database langsung"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Prinsip arsitektur S.O.L.I.D dalam OOP yang pertama adalah Single Responsibility Principle (SRP). Prinsip ini secara tegas menyarankan agar...', '["Sebuah proyek hanya boleh dikerjakan oleh satu programmer","Sebuah program hanya boleh memiliki satu fungsi Main","Sebuah kelas hanya boleh memuat maksimal satu metode","Sebuah kelas hanya boleh memiliki SATU alasan fungsional untuk dirubah (hanya melayani satu ranah tanggung jawab spesifik)","Sebuah database hanya boleh memiliki satu tabel induk"]'::jsonb, 3, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam desain Object Oriented, derajat ketergantungan atau ikatan antar kelas disebut dengan istilah ''Coupling''. Agar sistem stabil, mudah dimodifikasi, dan terisolasi dari bug berantai, arsitektur kelas harus dirancang agar memiliki tingkat Coupling yang...', '["Sangat Erat (Tight Coupling)","Longgar (Loose Coupling)","Saling Mengunci (Locked Coupling)","Nol / Tidak Terhubung Sama Sekali","Statis Konstan"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebaliknya, keterpaduan logika fungsionalitas di dalam tubuh satu kelas itu sendiri disebut ''Cohesion''. Kelas yang dirancang dengan sangat baik dan fokus pada satu tujuan utuh memiliki tingkat Cohesion yang...', '["Rendah (Low Cohesion)","Renggang dan Tersebar","Nol (Zero Cohesion)","Tinggi dan Terpusat (High Cohesion)","Fluktuatif"]'::jsonb, 3, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Problem ambiguitas logika saat sebuah bahasa OOP memungkinkan satu kelas mewarisi dua superclass yang memiliki nama metode yang persis sama, dikenal dalam ilmu komputer dengan sebutan...', '["The Triangle Exception","Polymorphic Paradox","Diamond Problem (Masalah Berlian)","Abstract Infinite Loop","Circular Dependency"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Seorang analis sistem E-Commerce merancang fungsionalitas Checkout. Saat manajemen ingin menambahkan metode pembayaran CryptoWallet baru, programmer HANYA membuat kelas baru yang mengimplementasikan antarmuka ''MetodePembayaran'' tanpa menyentuh sebaris kode pun di dalam kelas ''Checkout'' inti. Desain elegan ini mematuhi prinsip OOP...', '["Single Responsibility Principle","Open/Closed Principle (Terbuka untuk perluasan, Tertutup untuk modifikasi kode inti)","Interface Segregation Principle","Dependency Inversion Principle","Liskov Substitution Principle"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Di antara banyak Design Patterns, tipe pola ''Singleton'' secara arsitektural sangat berbeda dibandingkan instansiasi kelas normal. Perbedaan esensialnya adalah Singleton dirancang untuk...', '["Membuat ratusan objek seketika untuk efisiensi memori","Memastikan bahwa untuk kelas tersebut HANYA BOLEH ada satu-satunya objek (single instance) yang tercipta dan hidup memegang kendali penuh di memori global aplikasi","Menghancurkan seluruh variabel statis","Mewariskan fungsionalitas ke ribuan turunan dalam sepersekian detik","Membatasi enkapsulasi objek ke titik nol"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Jika terdapat rantai pewarisan hierarkis berlevel-level: Kelas A diturunkan ke B, B ke C, dan C ke D. Seorang junior developer merubah algoritma kecil di Kelas A, namun akibatnya proses perhitungan di Kelas D menjadi error parah. Fenomena kerentanan desain PBO ini dikenal dengan istilah...', '["Overriding Exception","Fragile Base Class Problem (Kerapuhan Kelas Dasar)","Dynamic Type Dispatch Delay","Multiple Inheritance Conflict","Abstraction Redundancy"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Ketika menjumpai relasi "Banyak-ke-Banyak" (Many-to-Many) ekstrem, seperti entitas ''Dokter'' yang menangani banyak ''Pasien'', dan ''Pasien'' ditangani banyak ''Dokter''. Solusi Object-Oriented paling rapi untuk menyimpan status diagnosis unik setiap perjumpaan adalah meletakkannya di dalam...', '["Array di dalam kelas Dokter","Variabel List di dalam kelas Pasien","Kelas Asosiasi/Penengah (Association Class) baru, misalnya kelas ''''RekamMedis'''' yang menghubungkan objek spesifik dari keduanya","Fungsi statis di modul utama program","Atribut abstrak tanpa definisi"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Anda merancang kelas abstrak PembuatanLaporan. Terdapat metode utama generate() yang alurnya dikunci baku: bukaFile(), tulisIsi(), dan tutupFile(). Subclass hanya diizinkan meng-override fungsionalitas tulisIsi() tanpa bisa merubah urutan alur utamanya. Pola desain PBO canggih ini disebut...', '["Factory Method Pattern","Observer Pattern","Decorator Pattern","Template Method Pattern","State Pattern"]'::jsonb, 3, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Prinsip Liskov Substitution Principle (LSP) menyatakan: "Objek turunan HARUS BISA MENGGANTIKAN objek induknya sepenuhnya tanpa merusak validitas sistem". Berdasarkan logika matematika OOP, manakah pewarisan yang sangat berpotensi melanggar LSP dan merusak sistem komputasi?', '["Kelas SegitigaSikuSiku mewarisi Segitiga","Kelas Ayam mewarisi Unggas","Kelas BujurSangkar mewarisi PersegiPanjang, yang memodifikasi secara paksa metode setLebar() untuk selalu merubah atribut panjang agar sisinya tetap sama","Kelas KaryawanBulanan mewarisi kelas Pekerja","Kelas Lingkaran mewarisi kelas BangunDatar2D"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Teknik rekayasa ''Dependency Injection'' merupakan cara elegan dalam PBO yang ditujukan agar...', '["Sebuah kelas tidak perlu melakukan inisiasi objek rumit (seperti koneksi database) sendiri di dalam fungsinya, melainkan disuntikkan dari luar (via Konstruktor) agar kelas tersebut independen, mudah dites, dan \\*loose coupled\\*","Membuat objek menjadi virus (injeksi) yang menempel ke program lain secara otomatis","Menghapus fungsionalitas encapsulation dari kelas sistem","Menyatukan (Injecting) puluhan kelas menjadi satu super-class masif","Menghentikan polimorfisme saat program sedang berjalan di memori"]'::jsonb, 0, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pemecahan komponen sistem PBO menjadi kategori: User Interface (Tampilan), Business Logic (Aturan Logika Inti Perusahaan), dan Data Access (Infrastruktur Database), merupakan manifestasi murni dari penerapan...', '["N-Tier / Layered Architecture (Arsitektur Berlapis)","Abstract Class Hierarchy","Multiple Threading","Database Normalization","Static Type Checking"]'::jsonb, 0, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam kajian Message Passing (Interaksi Komunikasi Objek), perbedaan fundamental mekanisme objek yang berkomunikasi secara ''Asynchronous'' dibandingkan ''Synchronous'' adalah...', '["Asynchronous membutuhkan kabel jaringan LAN untuk mengirim pesan","Synchronous bisa memanggil metode abstract, Asynchronous tidak bisa","Dalam pengiriman Asynchronous, Objek pengirim TIDAK PERLU menunggu objek penerima selesai mengerjakan tugasnya; pengirim bebas melanjutkan instruksi lainnya di saat yang bersamaan","Synchronous membuat program berjalan jauh lebih cepat tanpa jeda sedikitpun","Asynchronous mematikan memori komputer objek penerima pesan"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam konsep OOP, mekanisme penunjuk khusus (pointer) yang digunakan oleh sebuah objek untuk merujuk pada dirinya sendiri (dirinya yang sedang aktif saat ini) disebut sebagai variabel...', '["Super","This (Current Object Reference)","Static","Void","Null"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sementara itu, kata kunci atau mekanisme yang digunakan oleh kelas anak (subclass) untuk memanggil atribut atau metode milik kelas induknya (superclass) secara eksplisit disebut...', '["Super","This","Parent","Base","Inherit"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Modifier hak akses yang mengizinkan atribut atau fungsi untuk diakses oleh kelas itu sendiri, oleh semua turunannya (subclass), dan oleh kelas lain yang berada dalam satu paket (package) yang sama adalah...', '["Public","Private","Protected","Default","Static"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Fungsi/metode di dalam kelas dapat dirancang untuk mengembalikan suatu hasil atau nilai setelah diproses. Namun, jika sebuah fungsi dirancang khusus HANYA untuk mengeksekusi perintah tanpa mengembalikan nilai apa pun, fungsi tersebut berjenis...', '["Function / Return Type","Prosedur / Void","Parameter","Konstruktor","Argumen"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Nilai atau variabel yang disisipkan / dikirimkan ke dalam sebuah fungsi saat fungsi tersebut dipanggil dikenal dengan sebutan...', '["Properti","Parameter / Argumen","Tipe Data","Modifier","Kelas"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sistem memori pada perangkat lunak berbasis OOP modern memiliki fitur pembersih otomatis yang bertugas menghapus objek-objek di memori yang sudah tidak lagi digunakan atau tidak memiliki referensi. Fitur ini disebut...', '["Destructor","Memory Leak","Garbage Collection","Encapsulation","Overriding"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Hubungan pewarisan berjenjang, misalnya Kelas A diturunkan menjadi Kelas B, dan kemudian Kelas B diturunkan lagi menjadi Kelas C, disebut dengan konsep...', '["Single Inheritance","Multiple Inheritance","Multilevel Inheritance (Pewarisan Bertingkat)","Hierarchical Inheritance","Hybrid Inheritance"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah diagram terstruktur yang paling umum digunakan dalam rekayasa perangkat lunak untuk menggambarkan nama kelas, atribut, metode, dan garis-garis hubungan antar kelas disebut...', '["Use Case Diagram","Class Diagram (UML)","Activity Diagram","Sequence Diagram","Data Flow Diagram"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Membuat lebih dari satu fungsi konstruktor di dalam sebuah kelas yang sama, di mana masing-masing konstruktor memiliki jumlah atau jenis parameter yang berbeda-beda, merupakan teknik...', '["Constructor Overloading","Constructor Overriding","Interface Segregation","Object Casting","Parameter Hiding"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Variabel yang hanya dideklarasikan dan hanya bisa digunakan secara eksklusif di dalam sebuah fungsi (method) tertentu, serta akan musnah saat fungsi selesai dieksekusi disebut...', '["Variabel Global","Variabel Instans / Atribut","Variabel Statis","Variabel Lokal","Variabel Publik"]'::jsonb, 3, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Metode yang berfungsi khusus untuk mengubah (menyetel/memodifikasi) nilai dari suatu atribut internal yang terenkapsulasi disebut...', '["Accessor (Getter)","Mutator (Setter)","Constructor","Destructor","Dispatcher"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Metode yang berfungsi khusus HANYA untuk membaca (mengambil) nilai dari suatu atribut internal tanpa mengubahnya sedikitpun disebut...', '["Accessor (Getter)","Mutator (Setter)","Constructor","Destructor","Overrider"]'::jsonb, 0, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Konsep menciptakan atau membangun wujud fisik objek di dalam memori komputer berdasarkan cetak biru (class) yang telah didefinisikan sebelumnya dikenal dengan istilah...', '["Abstraksi","Enkapsulasi","Instansiasi (Instantiation)","Deklarasi","Polimorfisme"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Hubungan pewarisan (Inheritance) antar kelas pada hakikatnya selalu memetakan relasi konseptual yang berbunyi...', '["Memiliki Sebuah (Has-A)","Adalah Sebuah (Is-A)","Menggunakan Sebuah (Uses-A)","Terdiri Dari (Consists-Of)","Bagian Dari (Part-Of)"]'::jsonb, 1, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Suatu kesalahan fatal (error) dalam program PBO yang muncul karena kode mencoba memanggil metode atau atribut dari sebuah variabel objek yang ternyata masih kosong (belum diinisialisasi objek nyatanya) disebut...', '["Syntax Error","Logic Error","Null Reference Exception (Pointer Kosong)","Out of Memory Error","Stack Overflow Error"]'::jsonb, 2, 'easy', 1, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam fungsi ''setNama(String nama)'' di kelas Mahasiswa, atribut objek juga bernama ''nama''. Untuk membedakan mana parameter input dan mana atribut milik objek, programmer wajib menggunakan kata kunci penunjuk referensi diri (This). Tanpa kata kunci ini, yang terjadi adalah...', '["Terjadi error kompilasi seketika","Sistem otomatis mengetahui perbedaannya","Atribut objek akan menghapus parameter","Terjadi ''''Variable Hiding'''' (parameter menutupi atribut kelas, sehingga atribut tidak berubah nilainya)","Objek mahasiswa hancur dari memori"]'::jsonb, 3, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Kelas ''Ayah'' memiliki metode ''bekerja()''. Kelas ''Anak'' mewarisinya dan melakukan overriding metode ''bekerja()''. Suatu hari, di dalam metode ''bekerja()'' milik Anak, ia ingin tetap memanggil kebiasaan ''bekerja()'' versi Ayahnya terlebih dahulu sebelum menambahkan kebiasaannya sendiri. Teknik PBO yang digunakan adalah...', '["Memanggil objek Anak kembali secara rekursif","Memanggil metode menggunakan kata kunci referensi induk (Super)","Membuat kelas baru bernama Kakek","Melakukan overloading parameter","Mengubah metode ayah menjadi private"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Anda merancang kelas ''AkunBank''. Variabel ''sukuBunga'' bernilai 5% dan berlaku seragam untuk jutaan objek nasabah. Agar nilai 5% ini tidak disalin berulang kali ke jutaan memori (sangat boros), rancangan PBO terbaik adalah menjadikan ''sukuBunga'' sebagai...', '["Atribut Instans Private","Atribut Lokal Abstrak","Atribut Statis (Class Variable)","Method Void","Atribut Dinamis Polimorfik"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Aplikasi Kalkulator memiliki fungsi ''akarKuadrat()'' dan ''pangkat()''. Kita hanya butuh menghitung angkanya secara langsung, tanpa pernah perlu membuat instans objek fisik ''Kalkulator'' di memori. Solusinya, fungsionalitas matematika tersebut harus dideklarasikan sebagai...', '["Method Abstrak","Method Statis (Class Method)","Konstruktor Private","Enkapsulasi Ketat","Interface"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Analogi Mesin ATM: Ketika mesin mengeluarkan uang fisik dari celahnya untuk Anda ambil, ini analoginya mewakili sebuah Method yang...', '["Bersifat Abstract","Bersifat Void (Hanya prosedur)","Memiliki Return Value (Nilai Kembalian)","Melakukan Polymorphism","Melakukan Overloading"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Analogi Mesin ATM Lanjutan: Ketika mesin mencetak struk transaksi lalu membuang riwayatnya tanpa ada nilai data komputasi yang dilempar balik ke sistem perbankan utama, method ini analoginya bersifat...', '["Void (Tanpa kembalian nilai)","Parameterisasi","Enkapsulasi","Mengembalikan Boolean","Agregasi Parsial"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Pemain game mengendalikan ''Ksatria'' yang menyerang ''Monster''. Jika HP (Health) Monster habis, objek Monster dihapus dari array musuh aktif. Tak lama setelahnya, memori komputer yang dipakai Monster tersebut dibersihkan otomatis oleh sistem Java agar tidak membuat game patah-patah (lag). Proses pembersihan ini dikerjakan oleh...', '["Polimorfisme Taktis","Garbage Collector (Pengepul Sampah)","Overriding Alokasi","Destruktor Manual","Metode Void Statis"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Kelas ''Dokumen'' menyimpan teks laporan. Anda mendesain format ''CetakPDF'' dan ''CetakWord''. Keduanya memiliki karakteristik persis sama: harus punya tombol ''Print'' dan ''Preview''. Pendekatan desain yang paling rapi adalah...', '["Menyatukan mereka di kelas Dokumen","Membuat antarmuka (Interface) atau kelas Abstrak ''''FormatCetak'''' lalu mewariskannya ke PDF dan Word","Menghapus kelas Dokumen","Menggunakan Enkapsulasi tanpa Polimorfisme","Menerapkan Agregasi secara langsung"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Seorang pengguna mengklik tombol ''Login'' di layar, layar kemudian memerintahkan kelas ''Database'' untuk mengecek password. Interaksi pemanggilan ini dalam teori PBO murni disebut konsep...', '["Object Referencing","State Machine","Message Passing (Pengiriman Pesan antar Objek)","Method Overloading","Data Hiding"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Di sebuah aplikasi e-commerce, satu objek ''Keranjang'' memiliki daftar barang. Jika aplikasi ditutup tapi keranjang itu otomatis tersimpan di database untuk dibuka lagi besok, konsep mempertahankan wujud state objek agar tidak hilang ini disebut...', '["Instansiasi","Object Persistence (Persistensi Objek)","Enkapsulasi Permanen","Abstrak Statis","Garbage Collection Delay"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Terdapat kelas A (Kakek), kelas B (Ayah), dan kelas C (Anak). Jika kelas A memiliki atribut ''Harta'' berstatus Protected, apakah Kelas C (Anak) dapat mengaksesnya?', '["Tidak, karena Protected hanya bisa diakses 1 level (Ayah saja)","Ya, karena Protected bisa diturunkan secara berjenjang ke semua garis keturunan (Multilevel)","Tidak, karena harta harus diset menjadi Publik","Ya, asalkan Kelas C tidak mengubah isinya","Tidak, harus melewati Interface"]'::jsonb, 1, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Anda ditugaskan mendesain sistem "Colokan USB". Flashdisk, Mouse, dan Keyboard bisa dimasukkan ke colokan USB tersebut dan komputer akan merespon sesuai alatnya. "Colokan USB" dalam PBO paling tepat direpresentasikan sebagai...', '["Variabel Lokal","Metode Statis","Antarmuka / Kontrak (Interface)","Konstruktor Ganda","Modifier Default"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam pembuatan game FPS, pemain bisa menekan tombol 1 (Pistol) atau 2 (Senapan). Ketika tombol "Tembak" diklik, perilaku senjata berbeda secara instan (Pistol lambat, Senapan beruntun) padahal fungsi pemanggilnya persis sama. Ini menunjukkan kemampuan OOP dalam hal...', '["Mengganti wujud Polimorfisme pada saat aplikasi sedang berjalan (Runtime/Dynamic Polymorphism)","Overloading pada saat kompilasi program","Enkapsulasi Konstruktor Bertingkat","Agregasi Taktikal","Single Inheritance Error"]'::jsonb, 0, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sistem memanggil perintah ''cetakTeks()'' pada sebuah objek. Normalnya Java mencetak kode memori aneh (hashcode). Programmer kemudian melakukan ''Overriding'' terhadap metode pembacaan string bawaan kelas tersebut agar mengeluarkan teks format nama pegawai yang rapi. Ini adalah studi kasus manipulasi perilaku bawaan menggunakan...', '["Overloading Parameter","Konstruktor Dinamis","Method Overriding","Object Casting","Final Class Modifier"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Jika Anda merancang kelas konseptual ''HewanPelacak'' untuk kantor polisi, tapi Anda sadar bahwa di lapangan tidak ada entitas murni bernama HewanPelacak (pastinya itu Anjing, Kucing, dsb). Maka langkah perancangan Anda yang benar adalah...', '["Menjadikan ''''HewanPelacak'''' sebagai objek langsung instansiasi","Menghapus kelas ''''HewanPelacak'''' karena tidak ada gunanya","Menjadikan kelas ''''HewanPelacak'''' sebagai kelas Abstrak yang mencegah ia dijadikan objek nyata","Menjadikan kelas ''''HewanPelacak'''' berstatus Final","Melakukan Message Passing ke kelas Polisi"]'::jsonb, 2, 'medium', 2, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam Prinsip SOLID, ada "Open/Closed Principle" (OCP). Artinya sebuah entitas sistem OOP harus TERBUKA untuk perluasan, tapi TERTUTUP untuk modifikasi. Pendekatan arsitektur mana di bawah ini yang mematuhi aturan tersebut?', '["Mengubah kode kelas utama secara terus menerus setiap ada permintaan fitur baru","Membuat antarmuka (Interface/Abstract) dan menambahkan kelas turunan baru saat fitur baru dibutuhkan tanpa mengganggu kode kelas aslinya","Mengelompokkan semua fungsi bisnis menjadi satu kelas sangat besar (God Object)","Menggunakan variabel global bertipe boolean yang sangat banyak untuk melakukan IF-ELSE","Menghapus teknik Pewarisan sepenuhnya"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah kelas ControllerA memiliki koneksi kaku langsung dengan spesifik kelas MySQLDatabase. Jika perusahaan ganti ke OracleDatabase, ControllerA error dan harus dibongkar ulang. Solusi arsitektural OOP adalah menggunakan antarmuka IDatabase sebagai perantara. Prinsip ini dinamakan...', '["Single Responsibility Principle","Dependency Inversion Principle (DIP) / Ketergantungan Terbalik","Interface Segregation Principle (ISP)","Garbage Collection Overriding","Multilevel Instantiation"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Prinsip "Interface Segregation Principle" (ISP) dari SOLID menyatakan bahwa "Klien tidak boleh dipaksa bergantung pada antarmuka/metode yang tidak mereka gunakan". Apa indikator terkuat bahwa suatu desain sistem OOP melanggar ISP?', '["Banyaknya kelas yang menggunakan polimorfisme dinamis","Kelas induk memiliki banyak sekali subclass","Sebuah kelas turunan menerapkan Interface besar yang memaksa kelas tersebut menulis implementasi ''''kosong'''' atau ''''melempar error'''' pada fungsi-fungsi yang tidak dibutuhkannya","Menggunakan Dependency Injection terlalu sering","Penggunaan modifier private pada semua atribut"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Sebuah pola desain perangkat lunak (Design Pattern) di mana sistem secara otomatis memberitahukan kumpulan objek-objek lain yang sedang ''menyimak/memantau'' jika ada perubahan data pada suatu kelas (seperti fitur notifikasi Push M-Banking). Pola ini adalah...', '["Observer Pattern","Factory Method Pattern","Singleton Pattern","State Pattern","Decorator Pattern"]'::jsonb, 0, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Anda memerlukan mekanisme terpusat di mana alih-alih memanggil perintah ''New Object()'' tersebar di mana-mana yang membuat sistem kaku, Anda membuat sebuah kelas khusus yang bertugas khusus untuk memproduksi objek sesuai jenis yang diminta. Pola desain PBO ini adalah...', '["Template Method Pattern","Observer Pattern","Factory Pattern (Pola Pabrik)","Strategy Pattern","Multiple Inheritance Pattern"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, '"Constructor Chaining" adalah teknik di mana...', '["Objek membuat antrian di dalam memori saat aplikasi sedang melambat","Sebuah konstruktor secara internal memanggil konstruktor lain (menggunakan this() atau super()) di dalam kelas yang sama atau induknya, untuk menghindari penulisan kode inisialisasi yang berulang-ulang","Destruktor memanggil konstruktor agar objek bangkit kembali","Enkapsulasi dipecah menjadi beberapa bagian variabel kecil berantai","Parameter metode diberikan nilai tak terhingga secara rekursif"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Arsitek membuat kelas objek teks (String) dalam bahasa Java agar bersifat "Immutable" (Tidak bisa diubah wujud nilainya setelah diciptakan). Jika programmer memodifikasi string, memori akan membuat objek yang benar-benar baru. Manfaat strategis terbesar dari "Immutability" dalam OOP adalah...', '["Sangat menghemat kapasitas harddisk","Mempercepat koneksi internet klien","Menjamin keamanan data mutlak di lingkungan pemrosesan paralel (Multithreading/Thread-Safe) karena tidak ada risiko data bertabrakan diubah diam-diam","Mengizinkan penerapan Polimorfisme level rendah","Mencegah aplikasi ditutup secara paksa oleh sistem operasi"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Ketika memprogram sistem aplikasi yang kritis terhadap error (seperti sistem finansial), OOP menyediakan paradigma untuk melokalisasi kegagalan agar aplikasi tidak crash seketika saat hal tak terduga terjadi. Ini disebut dengan konsep manajemen...', '["Class Abstraction","Message Passing Error","Exception Handling (Penanganan Eksepsi/Objek Error)","Aggregation Conflict","Method Overloading Fail-safe"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Dalam membaca diagram UML berskala enterprise, relasi Asosiasi sering dituliskan angka "Multiplicity" seperti "1" pada ujung A dan "0..\*" (Banyak) pada ujung B. Apa terjemahan operasionalnya?', '["Satu Objek A tidak memiliki hubungan dengan Objek B","Satu Objek A dapat terhubung ke nol atau banyak sekumpulan Objek B","Objek B mewarisi Objek A secara utuh","Objek A adalah turunan mutlak dari objek B","A dan B harus dihapus bersama-sama"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Mendesain kelas yang mencoba mengerjakan segalanya (Menangani GUI, menyimpan ke Database, sekaligus menghitung Logika Pajak). Pola ini melanggar banyak prinsip desain (Cohesion rendah) dan menghasilkan keruwetan absolut yang dalam rekayasa perangkat lunak disebut antipola (anti-pattern)...', '["God Object / Blob Class (Objek Dewa yang maha tahu)","The Diamond Problem","Loose Coupling Architecture","Strategy Dynamic Shift","Immutable Factory"]'::jsonb, 0, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Domain-Driven Design (DDD) adalah pengembangan arsitektural OOP yang sangat maju. Dalam DDD, objek yang diidentifikasi dari ''Identitas Uniknya'' (meski atribut lain berubah, dia tetap entitas yang sama, seperti Pasien Rumah Sakit) dinamakan sebagai...', '["Value Object","Domain Entity (Entitas Utama)","Singleton Resource","Data Transfer Object (DTO)","Factory Pattern"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Masih di ranah DDD: Objek yang diidentifikasi murni HANYA dari nilai propertinya saja dan tidak butuh identitas/ID unik (contoh: objek representasi Alamat: Jalan A No.1, atau objek Koordinat X:10 Y:20). Objek semacam ini sifatnya dibuang-ganti dan disebut...', '["Domain Entity","Value Object (Objek Nilai)","Abstract Base Class","Thread Synchronizer","Service Controller"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Suatu entitas aplikasi sering mengalami perubahan perilaku internal akibat berubahnya "Fase/Tahapan". Contohnya kelas ''VendingMachine'', perilakunya berubah jika koin ''Belum Dimasukkan'' vs ''Sudah Dimasukkan''. Pola desain OOP untuk memetakan transisi ini tanpa blok pernyataan IF-ELSE yang sangat panjang adalah menggunakan...', '["Decorator Pattern","Singleton Pattern","State Pattern (Pola Keadaan)","Abstract Factory Pattern","Model-View Pattern"]'::jsonb, 2, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Anda ingin membuat fitur untuk menambah kemampuan tambahan pada sebuah objek secara dinamis pada saat runtime, misalnya: objek kopi dasar dipesan, lalu kita bisa menempelkan fitur ekstra "tambah susu", lalu "tambah karamel" berlipat ganda, tanpa membuat subclass turunan permanen seperti ''KopiSusuKaramel''. Pola OOP ini disebut...', '["Observer Pattern","Decorator Pattern","Strategy Pattern","Multiple Inheritance Hierarchy","Database Relational Coupling"]'::jsonb, 1, 'hard', 3, 'PBO');

  INSERT INTO public.questions (id, exam_id, text, options, correct_answer, level, weight, topic)
  VALUES (gen_random_uuid(), v_exam_id, 'Terdapat prinsip krusial dalam perancangan aplikasi OOP besar, yaitu meminimalkan ''Tight Coupling'' (Ketergantungan yang Sangat Erat antar kelas) dan memaksimalkan ''High Cohesion'' (Kepaduan/Fokus tanggung jawab tinggi di dalam satu kelas). Dampak nyata dari sistem yang sukses menerapkan aturan ini adalah...', '["Kompilasi membutuhkan hardware super-komputer","Mustahil menggunakan sistem penyimpanan database relational","Sistem menjadi modular, komponen kelas mudah dicabut-pasang, diuji secara mandiri, dan perubahan di satu tempat tidak merusak area sistem lain (Highly Maintainable)","Kelas tidak dapat mewariskan fungsionalitasnya lagi sama sekali","Objek memori akan bertahan selamanya tanpa garbage collection"]'::jsonb, 2, 'hard', 3, 'PBO');

END $$;
