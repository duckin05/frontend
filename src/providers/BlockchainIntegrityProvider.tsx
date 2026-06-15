import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { useAuthStore } from "../store"

// ──────────────────────────────────────────
// Types for blockchain block
// ──────────────────────────────────────────
interface RawBlock {
  index: number
  timestamp: string
  data: unknown
  previous_hash: string
  hash: string
}

// ──────────────────────────────────────────
// Custom JSON serializer matching Python's json.dumps(sort_keys=True)
// Python default separators: ", " between items, ": " between key:value
//
// Python example:
//   json.dumps({"a": 1, "b": 2}, sort_keys=True)
//   → '{"a": 1, "b": 2}'
//
// Comma + space (", ") between items, colon + space (": ") between key:value
// ──────────────────────────────────────────
function pyStringifyString(str: string): string {
  // Match Python's json.dumps(ensure_ascii=True)
  // Non-ASCII chars → \uXXXX, special chars → escaped
  let result = '"'
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    const code = str.charCodeAt(i)
    if (code < 128) {
      if (ch === '"') result += '\\"'
      else if (ch === '\\') result += '\\\\'
      else if (ch === '\n') result += '\\n'
      else if (ch === '\r') result += '\\r'
      else if (ch === '\t') result += '\\t'
      else if (ch === '\b') result += '\\b'
      else if (ch === '\f') result += '\\f'
      else result += ch
    } else {
      // Non-ASCII: escape as \uXXXX (lowercase hex, 4 digits)
      result += '\\u' + code.toString(16).padStart(4, '0')
    }
  }
  result += '"'
  return result
}

export function pyStringify(value: unknown): string {
  if (typeof value === "string") return pyStringifyString(value)
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (value === null) return "null"
  if (Array.isArray(value)) {
    return `[${value.map(pyStringify).join(", ")}]`
  }
  if (typeof value === "object" && value !== null) {
    const keys = Object.keys(value).sort()
    return `{${keys.map((k) => `"${k}": ${pyStringify((value as Record<string, unknown>)[k])}`).join(", ")}}`
  }
  return String(value)
}

// ──────────────────────────────────────────
// SHA-256 hex digest via Web Crypto API
// ──────────────────────────────────────────
async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// ──────────────────────────────────────────
// Check a single block's hash
// ──────────────────────────────────────────
async function computeBlockHash(block: RawBlock): Promise<string> {
  const blockString = pyStringify({
    data: block.data,
    index: block.index,
    previous_hash: block.previous_hash,
    timestamp: block.timestamp,
  })
  return sha256Hex(blockString)
}

// ──────────────────────────────────────────
// Verify full chain integrity from raw file data
// Returns list of invalid blocks (empty = all valid)
// ──────────────────────────────────────────
async function verifyFromRawBlocks(blocks: RawBlock[]): Promise<InvalidBlockInfo[]> {
  const invalidBlocks: InvalidBlockInfo[] = []
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i]
    const prevBlock = blocks[i - 1]
    const computedHash = await computeBlockHash(block)
    // Compare computed hash with stored hash
    if (computedHash !== block.hash) {
      invalidBlocks.push({
        index: block.index,
        storedHash: block.hash,
        computedHash,
        data: block.data,
        timestamp: block.timestamp,
        issue: "hash_mismatch",
      })
      continue
    }
    // Verify chain link
    if (block.previous_hash !== prevBlock.hash) {
      invalidBlocks.push({
        index: block.index,
        storedHash: block.hash,
        computedHash,
        data: block.data,
        timestamp: block.timestamp,
        issue: "chain_broken",
      })
    }
  }
  return invalidBlocks
}

// ──────────────────────────────────────────
// Fetch raw blockchain_data.json directly from disk (via Vite middleware)
// ──────────────────────────────────────────
async function fetchRawBlocks(): Promise<RawBlock[]> {
  const response = await fetch(`/api/blockchain-data?_=${Date.now()}`, {
    cache: "no-store",
    headers: { "Pragma": "no-cache" },
  })
  if (!response.ok) throw new Error("Không thể đọc blockchain_data.json")
  return response.json()
}

// ──────────────────────────────────────────
// Fetch blockchain data from API (fallback)
// ──────────────────────────────────────────
async function fetchApiBlocks(): Promise<RawBlock[]> {
  const res = await fetch("/api/blockchain", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  if (!res.ok) throw new Error("API không khả dụng")
  const json = await res.json()
  return json?.blocks || []
}

// ──────────────────────────────────────────
// Types for integrity details
// ──────────────────────────────────────────
export interface InvalidBlockInfo {
  index: number
  storedHash: string
  computedHash: string
  data: unknown
  timestamp: string
  issue: "hash_mismatch" | "chain_broken"
}

// ──────────────────────────────────────────
// Context
// ──────────────────────────────────────────
interface IntegrityState {
  isValid: boolean | null
  isChecking: boolean
  error: string | null
  check: () => Promise<void>
  dismiss: () => void
  isDismissed: boolean
  invalidBlocks: InvalidBlockInfo[]
  showDetail: boolean
  setShowDetail: (show: boolean) => void
}

const BlockchainIntegrityContext = createContext<IntegrityState>({
  isValid: null,
  isChecking: false,
  error: null,
  check: async () => {},
  dismiss: () => {},
  isDismissed: false,
  invalidBlocks: [],
  showDetail: false,
  setShowDetail: () => {},
})

export function useBlockchainIntegrity() {
  return useContext(BlockchainIntegrityContext)
}

// ──────────────────────────────────────────
// Provider – reads blockchain_data.json trực tiếp từ disk qua Vite middleware,
// tính toán SHA-256 hash ở phía frontend, và so sánh.
// Chỉ admin mới được kiểm tra; student không thấy gì.
// ──────────────────────────────────────────
export function BlockchainIntegrityProvider({ children }: { children: ReactNode }) {
  const role = useAuthStore((s) => s.role)
  const isAdmin = role === "admin"
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem("integrityDismissed") === "true"
  })
  const [invalidBlocks, setInvalidBlocks] = useState<InvalidBlockInfo[]>([])
  const [showDetail, setShowDetail] = useState(false)

  const dismiss = useCallback(() => {
    sessionStorage.setItem("integrityDismissed", "true")
    setIsDismissed(true)
  }, [])

  const check = useCallback(async () => {
    if (!isAdmin) return
    setIsChecking(true)
    setError(null)
    setIsDismissed(false)
    sessionStorage.removeItem("integrityDismissed")
    try {
      // Ưu tiên đọc trực tiếp từ disk (qua Vite middleware /blockchain-data)
      let blocks: RawBlock[] = []
      try {
        blocks = await fetchRawBlocks()
      } catch {
        // Fallback: đọc từ API (in-memory) nếu Vite middleware không hoạt động
        blocks = await fetchApiBlocks()
      }

      if (!blocks || blocks.length === 0) {
        setIsValid(true)
        return
      }

      // Debug: verify hash cho block đầu tiên (index 1)
      if (blocks.length > 1) {
        const blockStr = pyStringify({
          data: blocks[1].data,
          index: blocks[1].index,
          previous_hash: blocks[1].previous_hash,
          timestamp: blocks[1].timestamp,
        })
        console.log("[BlockchainIntegrity] Block 1 string:", blockStr)
        console.log("[BlockchainIntegrity] Block 1 stored hash:", blocks[1].hash)
      }

      const invalid = await verifyFromRawBlocks(blocks)
      setInvalidBlocks(invalid)
      const valid = invalid.length === 0
      setIsValid(valid)
      console.log("[BlockchainIntegrity] Integrity valid:", valid, "Invalid blocks:", invalid.length)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể kiểm tra blockchain"
      setError(message)
      setIsValid(null)
    } finally {
      setIsChecking(false)
    }
  }, [isAdmin])

  // Auto-check when app mounts (nếu là admin)
  useEffect(() => {
    if (isAdmin) check()
  }, [isAdmin, check])

  // Auto-refresh every 30 seconds while app is open (chỉ admin)
  useEffect(() => {
    if (!isAdmin) return
    const interval = setInterval(check, 30_000)
    return () => clearInterval(interval)
  }, [isAdmin, check])

  // Non-admin: không expose gì cả
  const contextValue: IntegrityState = {
    isValid: isAdmin ? isValid : null,
    isChecking: isAdmin ? isChecking : false,
    error: isAdmin ? error : null,
    check: isAdmin ? check : async () => {},
    dismiss: isAdmin ? dismiss : () => {},
    isDismissed: isAdmin ? isDismissed : false,
    invalidBlocks: isAdmin ? invalidBlocks : [],
    showDetail: isAdmin ? showDetail : false,
    setShowDetail: isAdmin ? setShowDetail : () => {},
  }

  return (
    <BlockchainIntegrityContext.Provider value={contextValue}>
      {children}
    </BlockchainIntegrityContext.Provider>
  )
}
