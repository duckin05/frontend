export type Theme = "light" | "dark"

export interface ToastMessage {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
  duration?: number
}

export type SidebarState = "expanded" | "collapsed"
