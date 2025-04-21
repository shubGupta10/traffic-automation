import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  authToken: string | null;
  setUserDetails: (user: User) => void;
  setAuthToken: (token: string) => void;
  fetchAuthenticatedUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      authToken: null,

      setUserDetails: (user: User) => {
        set({ user });
      },

      setAuthToken: (token: string) => {
        set({ authToken: token });
      },

      fetchAuthenticatedUser: async () => {
        try {
          const res = await fetch("/api/fetch-Authenticated-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store", 
          });

          if (!res.ok) {
            console.warn("User not authenticated.");
            set({ user: null, authToken: null });
            return;
          }

          const data = await res.json();
          set({ user: data.user });
        } catch (error) {
          console.error("Failed to fetch authenticated user:", error);
          set({ user: null, authToken: null });
        }
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
