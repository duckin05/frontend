import { AuthIllustration } from "../../components/auth/AuthIllustration"
import { LoginForm } from "../../components/auth/LoginForm"

export function LoginPage() {
  return (
    <div className="flex w-full max-w-5xl min-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-base-100 border border-base-300/20">
      {/* Left: Brand Illustration */}
      <div className="hidden md:flex md:w-1/2 p-6 bg-gradient-to-br from-base-200/50 to-base-300/30">
        <AuthIllustration />
      </div>

      {/* Right: Login Form */}
      <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center">
        <div className="w-full max-w-sm mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
