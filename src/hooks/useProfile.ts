import { useState } from "react"
import { profileService } from "../services"

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const changePassword = async (old_password: string, new_password: string) => {
    setIsLoading(true)
    try { return await profileService.changePassword(old_password, new_password) }
    finally { setIsLoading(false) }
  }
  return { changePassword, isLoading }
}
