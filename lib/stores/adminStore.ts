import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  currentPage: string;
  isAuthenticated: boolean;
  admin: {
    uid: string;
    name: string;
    email: string;
    role: string;
  } | null;
  setCurrentPage: (page: string) => void;
  setAuthenticated: (value: boolean) => void;
  setAdmin: (admin: AdminState['admin']) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      currentPage: 'dashboard',
      isAuthenticated: false,
      admin: null,
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      
      setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),
      
      logout: () => set({ admin: null, isAuthenticated: false, currentPage: 'login' }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
      }),
    }
  )
);
