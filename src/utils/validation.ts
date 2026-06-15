import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

export const registerSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  student_id: z.string().min(1, "Vui lòng nhập mã sinh viên"),
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  student_class: z.string().min(1, "Vui lòng nhập lớp"),
})

export const studentSchema = z.object({
  ma_sv: z.string().min(1, "Vui lòng nhập mã sinh viên"),
  ten: z.string().min(1, "Vui lòng nhập họ tên"),
  lop: z.string().min(1, "Vui lòng nhập lớp"),
})

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  new_password: z.string().min(6, "Mật khẩu mới ít nhất 6 ký tự"),
  confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirm_password"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type StudentFormData = z.infer<typeof studentSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
