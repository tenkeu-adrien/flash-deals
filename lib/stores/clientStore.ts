import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { 
  onAuthStateChange, 
  loginWithEmail, 
  loginWithGoogle, 
  loginWithFacebook,
  signupWithEmail,
  logout as firebaseLogout,
  getUserProfile,
  UserData
} from '@/lib/firebase/auth';
import {
  getActiveCampaigns,
  getCart,
  addToCart as firestoreAddToCart,
  removeFromCart as firestoreRemoveFromCart,
  clearCart as firestoreClearCart,
  onCartChange,
  Campaign
} from '@/lib/firebase/firestore';

export interface CartItem {
  id: string;
  campaignId: string;
  quantity: number(id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setPreferences: (preferences: string[]) => void;
  togglePreference: (preference: string) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  currentPage: 'home',
  isAuthenticated: false,
  user: null,
  cart: [],
  preferences: [],
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  
  setUser: (user) => set({ user }),
  
  addToCart: (item) => set((state) => {
    const existingItem = state.cart.find(i => i.id === item.id);
    if (existingItem) {
      return {
        cart: state.cart.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),
  
  updateQuantity: (id, quantity) => set((state) => ({
    cart: state.cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    )
  })),
  
  clearCart: () => set({ cart: [] }),
  
  setPreferences: (preferences) => set({ preferences }),
  
  togglePreference: (preference) => set((state) => {
    const exists = state.preferences.includes(preference);
    return {
      preferences: exists
        ? state.preferences.filter(p => p !== preference)
        : [...state.preferences, preference]
    };
  }),
}));
