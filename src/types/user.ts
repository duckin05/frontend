export interface IUser {
  username: string
  password: string
  role: "admin" | "user"
  student_id?: string
  photo?: string
}

export interface LoginPayload {
  username: string
  password: string
  role?: "admin" | "student"
}

export interface RegisterPayload {
  username: string
  password: string
  student_id: string
  name: string
  student_class: string
  photo?: File
}

export interface AuthResponse {
  token: string
  user: IUser
  role: "admin" | "user"
}
