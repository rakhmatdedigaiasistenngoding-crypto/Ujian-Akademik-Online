import { useEffect } from 'react';
import { useNetworkStore } from '../stores/networkStore';
import { toast } from 'sonner';

export function useOnlineStatus() {
  const { isOnline, setOnlineStatus, pendingSubmissions } = useNetworkStore();

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      toast.success('Koneksi internet kembali pulih.', {
        description: 'Anda kembali terhubung dengan server.',
        duration: 4000,
      });
      
      // We will handle retrying pending submissions here in Phase 2
      if (pendingSubmissions.length > 0) {
        toast.info(`Ada ${pendingSubmissions.length} data ujian yang akan disinkronisasi.`);
        // TODO: trigger sync action
      }
    };

    const handleOffline = () => {
      setOnlineStatus(false);
      toast.error('Koneksi internet terputus!', {
        description: 'Jangan khawatir, jawaban Anda tersimpan otomatis di perangkat.',
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus, pendingSubmissions]);

  return isOnline;
}
