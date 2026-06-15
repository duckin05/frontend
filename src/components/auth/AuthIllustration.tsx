import { APP_TAGLINE } from "../../utils/constants"

export function AuthIllustration() {
  return (
    <div className="relative min-h-[320px] rounded-2xl overflow-hidden flex flex-col justify-center p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-base-300/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      </div>
      <div className="relative z-10 mb-6 flex items-center justify-center gap-3">
        {[0, 1, 2, 3, 4].map((i: number) => (
          <div key={i} className="flex items-center">
            <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary/20 animate-pulse-glow" style={{ animationDelay: `${i * 0.3}s` }} />
            {i < 4 && <div className="w-8 h-0.5 bg-gradient-to-r from-primary/60 to-secondary/60" />}
          </div>
        ))}
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Blockchain Student Vault
        </h2>
        <p className="text-base-content/70 text-sm leading-relaxed mb-4">
          Hệ thống quản lý sinh viên an toàn, minh bạch
          và hiện đại với công nghệ blockchain.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/50 border border-base-300/30 backdrop-blur-sm">
          <span className="text-xs font-medium text-base-content/60">{APP_TAGLINE}</span>
        </div>
      </div>
      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
        {["Secure", "Transparent", "Fast", "Decentralized"].map((feature) => (
          <span key={feature} className="px-3 py-1 text-xs font-medium rounded-full bg-base-100/40 border border-base-300/20 text-base-content/60">
            {feature}
          </span>
        ))}
      </div>
    </div>
  )
}
