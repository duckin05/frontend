const API_BASE = "/api"

export const API = {
  LOGIN: `${API_BASE}/login`,
  REGISTER: `${API_BASE}/register`,
  STUDENT_LOGIN: `${API_BASE}/student/login`,
  STUDENT_REGISTER: `${API_BASE}/student/register`,
  DASHBOARD: `${API_BASE}/dashboard`,
  STUDENTS: `${API_BASE}/students`,
  STUDENT_DETAIL: (ma_sv: string) => `${API_BASE}/students/${ma_sv}`,
  BLOCKCHAIN: `${API_BASE}/blockchain`,
  CHAT: `${API_BASE}/chat`,
  IMPORT: `${API_BASE}/import`,
  EXPORT: `${API_BASE}/export`,
  CHANGE_PASSWORD: `${API_BASE}/change-password`,
  PROFILE: `${API_BASE}/profile`,
  STUDENT_SYNC: `${API_BASE}/student-sync`,
} as const
