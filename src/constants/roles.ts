export const ROLES = {
  ADMIN: "admin" as const,
  USER: "user" as const,
}

export function isAdmin(role: string): boolean {
  return role === ROLES.ADMIN
}
