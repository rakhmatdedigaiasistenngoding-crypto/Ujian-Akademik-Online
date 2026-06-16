-- ============================================================================
-- Migration 06: Restrict Email Domain Trigger
-- ============================================================================
-- Trigger ini memvalidasi email pengguna sebelum masuk ke auth.users.
-- Hanya email dengan domain kampus yang diperbolehkan mendaftar/masuk.

CREATE OR REPLACE FUNCTION public.check_user_email_domain()
RETURNS TRIGGER AS $$
DECLARE
  -- GANTI domain di bawah ini dengan domain kampus Anda (misal: 'univ.ac.id')
  allowed_domain TEXT := 'teknokrat.ac.id'; 
  allowed_lecturer_domain TEXT := 'teknokrat.ac.id';
  user_email TEXT;
BEGIN
  user_email := LOWER(NEW.email);
  
  -- Cek apakah email berakhiran dengan domain mahasiswa atau dosen yang diizinkan
  IF user_email LIKE '%@' || allowed_domain OR user_email LIKE '%@' || allowed_lecturer_domain THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'Akses ditolak: Registrasi hanya diperbolehkan menggunakan email resmi kampus (@% atau @%)', allowed_domain, allowed_lecturer_domain;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hapus trigger jika sudah ada sebelumnya
DROP TRIGGER IF EXISTS check_user_email_domain_trigger ON auth.users;

-- Buat trigger BEFORE INSERT pada auth.users
CREATE TRIGGER check_user_email_domain_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_user_email_domain();
