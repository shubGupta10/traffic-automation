import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  authToken: string | null;
  setUserDetails: (user: User) => void;
  setAuthToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      authToken: null,

      setUserDetails: (user: User) => {
        set({ user });
      },

      setAuthToken: (token: string) => {
        set({ authToken: token });
      },

      logout: () => {
        set({ user: null, authToken: null });
      },
    }),
    {
      name: "auth-storage", 
    }
  )
);
