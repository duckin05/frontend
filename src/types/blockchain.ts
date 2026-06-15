export interface IBlock {
  index: number
  timestamp: string
  data: Record<string, unknown> | string
  previous_hash: string
  hash: string
  isValid?: boolean
}

export interface BlockchainStatus {
  valid: boolean
  totalBlocks: number
  totalStudents: number
  blocks: IBlock[]
  chainHash?: string
}
