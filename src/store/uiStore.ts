import { create } from "zustand"
import type { Theme, ToastMessage, SidebarState } from "../types"

interface UIState {
  theme: Theme
  sidebar: SidebarState
  toasts: ToastMessage[]
  activeModal: string | null
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  addToast: (toast: Omit<ToastMessage, "id">) => void
  removeToast: (id: string) => void
  setActiveModal: (modal: string | null) => void
}

export const useUIStore = create<UIState>((set) => {
  return {
    theme: (localStorage.getItem("theme") as Theme) || "light",
    sidebar: "expanded",
    toasts: [],
    activeModal: null,
    setTheme: (theme) => {
      localStorage.setItem("theme", theme)
      set({ theme })
    },
    toggleSidebar: () => set((state) => {
      return { sidebar: state.sidebar === "expanded" ? "collapsed" : "expanded" }
    }),
    addToast: (toast) => set((state) => {
      return { toasts: [...state.toasts, { ...toast, id: Date.now().toString() }] }
    }),
    removeToast: (id) => set((state) => {
      return { toasts: state.toasts.filter((t) => t.id !== id) }
    }),
    setActiveModal: (modal) => set({ activeModal: modal }),
  }
})
