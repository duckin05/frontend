import { useState } from "react"
import { excelService } from "../services"

export function useExcel() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const importExcel = async (file: File) => {
    setIsLoading(true)
    try {
      const response = await excelService.importExcel(file)
      setResult(response.message || "Import thanh cong")
      return response
    } finally { setIsLoading(false) }
  }
  const exportExcel = async () => {
    setIsLoading(true)
    try {
      const response = await excelService.exportExcel()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.download = "students.xlsx"
      link.click()
      link.remove()
    } finally { setIsLoading(false) }
  }
  return { importExcel, exportExcel, isLoading, result }
}
