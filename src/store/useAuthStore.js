import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoading: true,
  isAuthenticated: false,
  user: undefined,
  init: ({ isLoading, isAuthenticated }) =>
    set((state) => ({ ...state, isLoading, isAuthenticated })),
  setUser: (user) => set((state) => ({ ...state, user })),
  login: () => set((state) => ({ ...state, isAuthenticated: true })),
  logout: () => set((state) => ({ ...state, isAuthenticated: false, user: undefined })),
}));
