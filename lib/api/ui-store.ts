/**
 * UI Store
 * Zustand store for UI state management
 */

import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIStore {
  // Toast notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modals
  isModalOpen: Record<string, boolean>;
  openModal: (name: string) => void;
  closeModal: (name: string) => void;
  toggleModal: (name: string) => void;

  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;

  // Language
  language: string;
  setLanguage: (lang: string) => void;

  // Loading states
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Toast notifications
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: `${Date.now()}-${Math.random()}`,
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Modals
  isModalOpen: {},
  openModal: (name) =>
    set((state) => ({
      isModalOpen: { ...state.isModalOpen, [name]: true },
    })),
  closeModal: (name) =>
    set((state) => ({
      isModalOpen: { ...state.isModalOpen, [name]: false },
    })),
  toggleModal: (name) =>
    set((state) => ({
      isModalOpen: { ...state.isModalOpen, [name]: !state.isModalOpen[name] },
    })),

  // Sidebar
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Theme
  theme: 'auto',
  setTheme: (theme) => set({ theme }),

  // Language
  language: 'en',
  setLanguage: (language) => set({ language }),

  // Loading states
  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),
}));

export default useUIStore;
