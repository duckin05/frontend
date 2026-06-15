export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  STUDENT_LOGIN: "/student/login",
  STUDENT_REGISTER: "/student/register",
  DASHBOARD: "/dashboard",
  STUDENTS: "/students",
  STUDENT_DETAIL: (ma_sv: string) => `/students/${ma_sv}`,
  BLOCKCHAIN: "/blockchain",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  IMPORT: "/import",
  CHAT: "/chat",
} as const
