interface PasswordStrength {
  score: number
  label: string
  color: string
  width: string
}

function calculateStrength(password: string): PasswordStrength {
  let score = 0

  if (password.length >= 6) score += 1
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  if (score <= 1) return { score, label: "Yếu", color: "bg-error", width: "w-1/5" }
  if (score === 2) return { score, label: "Trung bình", color: "bg-warning", width: "w-2/5" }
  if (score === 3) return { score, label: "Khá", color: "bg-info", width: "w-3/5" }
  if (score === 4) return { score, label: "Mạnh", color: "bg-success", width: "w-4/5" }
  return { score, label: "Rất mạnh", color: "bg-success", width: "w-full" }
}

export function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null

  const strength = calculateStrength(password)

  return (
    <div className="mt-1">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-1.5 rounded-full bg-base-300 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
          />
        </div>
        <span className="text-[10px] font-medium text-base-content/50 whitespace-nowrap">
          {strength.label}
        </span>
      </div>
    </div>
  )
}
