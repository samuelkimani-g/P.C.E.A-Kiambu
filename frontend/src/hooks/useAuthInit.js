import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuthInit = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return initialized;
};
