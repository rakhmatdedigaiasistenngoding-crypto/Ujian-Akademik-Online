-- Matikan validasi domain sementara untuk keperluan testing
ALTER TABLE auth.users DISABLE TRIGGER check_user_email_domain_trigger;
