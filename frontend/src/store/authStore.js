import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';
import api, { API_BASE_URL } from '../api/client';

const ACCESS_KEY = 'pcea_access_token';
const REFRESH_KEY = 'pcea_refresh_token';

const syncTokens = (access, refresh) => {
  if (access) {
    localStorage.setItem(ACCESS_KEY, access);
  } else {
    localStorage.removeItem(ACCESS_KEY);
  }
  if (refresh) {
    localStorage.setItem(REFRESH_KEY, refresh);
  } else {
    localStorage.removeItem(REFRESH_KEY);
  }
};

const extractPayload = (response) => {
  if (!response) return null;
  const { data } = response;
  if (data?.data) return data.data;
  return data;
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      initialized: false,

      setAuth: ({ user, access, refresh }) => {
        syncTokens(access ?? null, refresh ?? null);
        set({
          user: user ?? null,
          accessToken: access ?? null,
          refreshToken: refresh ?? null,
        });
      },

      login: async (credentials) => {
        set({ loading: true });
        try {
          const response = await api.post('/auth/login/', credentials);
          const payload = extractPayload(response);
          const tokens = payload?.tokens || payload;
          const user = payload?.user || payload?.data?.user;
          if (!tokens?.access) {
            throw new Error('Missing access token in login response.');
          }
          get().setAuth({ user, access: tokens.access, refresh: tokens.refresh });
          toast.success(`Welcome back ${user?.first_name || user?.username || ''}`.trim());
          return { user, tokens };
        } catch (error) {
          const message = error.response?.data?.detail || error.response?.data?.message || 'Invalid credentials';
          toast.error(message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      register: async (payload) => {
        set({ loading: true });
        try {
          const response = await api.post('/auth/register/', payload);
          const data = extractPayload(response);
          const tokens = data?.tokens;
          const user = data?.user;
          if (tokens?.access) {
            get().setAuth({ user, access: tokens.access, refresh: tokens.refresh });
          }
          toast.success('Account created successfully');
          return { user, tokens };
        } catch (error) {
          const firstError = error.response?.data;
          let message = 'Registration failed';
          if (typeof firstError === 'string') message = firstError;
          if (firstError?.detail) message = firstError.detail;
          if (firstError && typeof firstError === 'object') {
            const key = Object.keys(firstError)[0];
            if (key) message = Array.isArray(firstError[key]) ? firstError[key][0] : firstError[key];
          }
          toast.error(message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async () => {
        try {
          const response = await api.get('/auth/profile/');
          const profile = extractPayload(response);
          set({ user: profile, initialized: true });
          return profile;
        } catch (error) {
          set({ user: null, initialized: true });
          throw error;
        }
      },

      updateProfile: async (payload) => {
        try {
          const response = await api.patch('/auth/profile/', payload);
          const profile = extractPayload(response);
          set({ user: profile });
          toast.success('Profile updated');
          return profile;
        } catch (error) {
          const message = error.response?.data?.detail || 'Unable to update profile';
          toast.error(message);
          throw error;
        }
      },

      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken || localStorage.getItem(REFRESH_KEY);
        if (!refreshToken) return null;
        try {
          const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
          const { access, refresh } = extractPayload(response) || {};
          if (access) {
            syncTokens(access, refresh ?? refreshToken);
            set({ accessToken: access, refreshToken: refresh ?? refreshToken });
            return access;
          }
          return null;
        } catch {
          get().logout();
          return null;
        }
      },

      logout: () => {
        syncTokens(null, null);
        set({ user: null, accessToken: null, refreshToken: null });
        toast.success('Signed out');
      },

      initialize: async () => {
        if (get().initialized) return;
        const access = localStorage.getItem(ACCESS_KEY);
        const refresh = localStorage.getItem(REFRESH_KEY);
        if (!access && !refresh) {
          set({ initialized: true });
          return;
        }
        set({ accessToken: access, refreshToken: refresh });
        try {
          await get().fetchProfile();
        } catch {
          syncTokens(null, null);
          set({ user: null });
        } finally {
          set({ initialized: true });
        }
      },
    }),
    {
      name: 'pcea-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        syncTokens(state.accessToken, state.refreshToken);
      },
    },
  ),
);

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem(ACCESS_KEY)}`,
});

export const backendDocsUrl = `${API_BASE_URL}/docs/`;
