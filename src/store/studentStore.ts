import { create } from "zustand"
import type { IStudent, StudentListParams } from "../types"

interface StudentState {
  students: IStudent[]
  total: number
  params: StudentListParams
  isLoading: boolean
  error: string | null
  setStudents: (students: IStudent[], total: number) => void
  setParams: (params: Partial<StudentListParams>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addStudent: (student: IStudent) => void
  reset: () => void
}

const initialParams: StudentListParams = {
  q: "",
  page: 1,
  limit: 25,
  sort_by: "timestamp",
  sort_order: "desc",
}

export const useStudentStore = create<StudentState>((set) => {
  return {
    students: [],
    total: 0,
    params: initialParams,
    isLoading: false,
    error: null,
    setStudents: (students, total) => set({ students, total }),
    setParams: (params) => set((state) => {
      return { params: { ...state.params, ...params } }
    }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    addStudent: (student) => set((state) => {
      return { students: [student, ...state.students] }
    }),
    reset: () => set({ students: [], params: initialParams }),
  }
})
