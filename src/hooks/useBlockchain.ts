import { useState, useCallback } from "react"
import { blockchainService } from "../services"
import type { IBlock } from "../types"

export function useBlockchain() {
  const [blocks, setBlocks] = useState<IBlock[]>([])
  const [isValid, setIsValid] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchBlocks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await blockchainService.getAll()
      setBlocks(response.blocks || [])
      setIsValid(response.valid ?? true)
    } catch (err: any) {
      setError(err.message || "Loi khi tai blockchain")
    } finally {
      setIsLoading(false)
    }
  }, [])
  return { blocks, isValid, isLoading, error, fetchBlocks }
}
