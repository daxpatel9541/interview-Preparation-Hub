import { create } from 'zustand';

export type Section = 'lobby' | 'skydeck' | 'engine' | 'forge' | 'portals';

interface AppState {
  // Navigation
  currentSection: Section;
  scrollProgress: number;
  setCurrentSection: (section: Section) => void;
  setScrollProgress: (progress: number) => void;

  // Gamification
  coins: number;
  totalScore: number;
  addCoins: (amount: number) => void;
  addScore: (amount: number) => void;

  // UI State
  isLoading: boolean;
  loadingProgress: number;
  setIsLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Auth
  user: any | null;
  token: string | null;
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentSection: 'lobby',
  scrollProgress: 0,
  setCurrentSection: (section) => set({ currentSection: section }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  // Gamification
  coins: 0,
  totalScore: 0,
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  addScore: (amount) => set((state) => ({ totalScore: state.totalScore + amount })),

  // UI State
  isLoading: true,
  loadingProgress: 0,
  setIsLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),

  // Auth
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
