import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Campaign {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  stock: number;
  sold: number;
  status: 'active' | 'planned' | 'completed';
  startDate: string;
  endDate: string;
  image?: string;
}

interface VendorState {
  currentPage: string;
  isAuthenticated: boolean;
  vendor: {
    uid: string;
    name: string;
    businessName: string;
    email: string;
    phone: string;
    status: 'pending' | 'active' | 'rejected';
  } | null;
  campaigns: Campaign[];
  signupStep: number;
  setCurrentPage: (page: string) => void;
  setAuthenticated: (value: boolean) => void;
  setVendor: (vendor: VendorState['vendor']) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  setSignupStep: (step: number) => void;
  nextSignupStep: () => void;
  prevSignupStep: () => void;
  logout: () => void;
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set) => ({
      currentPage: 'landing',
      isAuthenticated: false,
      vendor: null,
      campaigns: [],
      signupStep: 1,
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      
      setVendor: (vendor) => set({ vendor, isAuthenticated: !!vendor }),
      
      addCampaign: (campaign) => set((state) => ({
        campaigns: [...state.campaigns, campaign]
      })),
      
      updateCampaign: (id, updates) => set((state) => ({
        campaigns: state.campaigns.map(c =>
          c.id === id ? { ...c, ...updates } : c
        )
      })),
      
      deleteCampaign: (id) => set((state) => ({
        campaigns: state.campaigns.filter(c => c.id !== id)
      })),
      
      setSignupStep: (step) => set({ signupStep: step }),
      
      nextSignupStep: () => set((state) => ({
        signupStep: Math.min(state.signupStep + 1, 4)
      })),
      
      prevSignupStep: () => set((state) => ({
        signupStep: Math.max(state.signupStep - 1, 1)
      })),
      
      logout: () => set({ 
        vendor: null, 
        isAuthenticated: false, 
        currentPage: 'landing',
        campaigns: [],
        signupStep: 1
      }),
    }),
    {
      name: 'vendor-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        vendor: state.vendor,
        currentPage: state.currentPage,
      }),
    }
  )
);
