export function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function formatDateTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString("vi-VN")
}

export function truncateHash(hash: string, length = 12): string {
  if (hash.length <= length) return hash
  return hash.slice(0, length) + "..."
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
