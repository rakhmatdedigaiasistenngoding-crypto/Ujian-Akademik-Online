import { useState, useEffect } from 'react';
import fpPromise from '@fingerprintjs/fingerprintjs';

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate the device fingerprint
    const getDeviceId = async () => {
      try {
        const fp = await fpPromise.load();
        const result = await fp.get();
        setDeviceId(result.visitorId);
      } catch (error) {
        console.error('Failed to generate device ID:', error);
        // Fallback for extreme cases (e.g., ad blockers blocking fingerprintjs)
        const fallbackId = localStorage.getItem('fallback_device_id') || crypto.randomUUID();
        if (!localStorage.getItem('fallback_device_id')) {
          localStorage.setItem('fallback_device_id', fallbackId);
        }
        setDeviceId(fallbackId);
      } finally {
        setIsLoading(false);
      }
    };

    getDeviceId();
  }, []);

  return { deviceId, isLoading };
}
