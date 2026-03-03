import { create } from 'zustand';

interface AdminState {
  currentPage: string;
  isAuthenticated: boolean;
  admin: {
    name: string;
    email: string;
    role: string;
  } | null;
  setCurrentPage: (page: string) => void;
  setAuthenticated: (value: boolean) => void;
  setAdmin: (admin: AdminState['admin']) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  currentPage: 'login',
  isAuthenticated: false,
  admin: null,
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  
  setAdmin: (admin) => set({ admin }),
}));
