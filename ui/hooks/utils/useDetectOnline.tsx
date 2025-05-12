import { checkWindow } from '@/lib/functions/_helpers.lib';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

function useOnlineStatus() {
  const _Window = checkWindow() ? window : null;

  useEffect(() => {
    if (checkWindow()) {
      window.addEventListener('online', () => toast.success('You are online'));
      window.addEventListener('offline', () => toast.error('You are offline'));
    }
  }, [_Window?.navigator?.onLine]);
}

export default useOnlineStatus;
