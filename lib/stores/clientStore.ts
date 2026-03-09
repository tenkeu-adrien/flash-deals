import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

// Types
export interface CartItem {
  id: string;
  campaignId: string;
  quantity: number;
  price: number;
  campaign?: any;
}

interface ClientState {
  currentPage: string;
  selectedCampaignId: string | null;
  isAuthenticated: boolean;
  user: User | null;
  cart: CartItem[];
  preferences: string[];
  setCurrentPage: (page: string) => void;
  setSelectedCampaignId: (id: string | null) => void;
  setAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setPreferences: (preferences: string[]) => void;
  togglePreference: (preference: string) => void;
  setCart: (cart: CartItem[]) => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      currentPage: 'home',
      selectedCampaignId: null,
      isAuthenticated: false,
      user: null,
      cart: [],
      preferences: [],

      setCurrentPage: (page) => set({ currentPage: page }),

      setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              )
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id)
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => (item.id === id ? { ...item, quantity } : item))
        })),

      clearCart: () => set({ cart: [] }),

      setPreferences: (preferences) => set({ preferences }),

      togglePreference: (preference) =>
        set((state) => {
          const exists = state.preferences.includes(preference);
          return {
            preferences: exists
              ? state.preferences.filter((p) => p !== preference)
              : [...state.preferences, preference]
          };
        }),

      setCart: (cart) => set({ cart })
    }),
    {
      name: 'client-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        currentPage: state.currentPage,
        selectedCampaignId: state.selectedCampaignId, // ✅ AJOUTÉ
        isAuthenticated: state.isAuthenticated,
        user: state.user
      })
    }
  )
);
