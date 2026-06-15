export interface IStudent {
  ma_sv: string
  ten: string
  lop: string
  timestamp: string
  created_by: string
  index?: number
  hash?: string
  previous_hash?: string
}

export interface CreateStudentPayload {
  ma_sv: string
  ten: string
  lop: string
}

export interface StudentListParams {
  q?: string
  lop?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: "asc" | "desc"
}
