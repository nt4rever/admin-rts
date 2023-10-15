import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoading: true,
  isAuthenticated: false,
  user: undefined,
  init: ({ isLoading, isAuthenticated, user }) =>
    set((state) => ({ ...state, isLoading, isAuthenticated, user })),
  logout: () => set((state) => ({ ...state, isAuthenticated: false, user: undefined })),
}));
