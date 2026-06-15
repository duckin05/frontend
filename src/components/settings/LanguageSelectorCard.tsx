import { useState } from "react"

type Language = "vi" | "en"

interface LangOption {
  code: Language
  label: string
  native: string
  flag: string
}

const LANGUAGES: LangOption[] = [
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
]

const STORAGE_KEY = "language"

function loadLanguage(): Language {
  return (localStorage.getItem(STORAGE_KEY) as Language) || "vi"
}

function saveLanguage(lang: Language) {
  localStorage.setItem(STORAGE_KEY, lang)
}

export function LanguageSelectorCard() {
  const [language, setLanguage] = useState<Language>(loadLanguage)

  const handleChange = (code: Language) => {
    setLanguage(code)
    saveLanguage(code)
  }

  return (
    <div className="card bg-base-100 border border-base-300/30 shadow-sm">
      <div className="card-body p-6">
        <h3 className="card-title text-base font-semibold mb-4">🌍 Ngôn ngữ</h3>
        <p className="text-sm text-base-content/60 mb-4">
          Chọn ngôn ngữ hiển thị cho hệ thống
        </p>

        <div className="flex gap-3">
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => handleChange(lang.code)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/20"
                    : "border-base-300/30 bg-base-200/30 hover:bg-base-200/50 hover:border-base-300/50"
                }`}
              >
                <span className="text-3xl">{lang.flag}</span>
                <span className={`text-sm font-semibold ${isActive ? "text-primary" : "text-base-content/70"}`}>
                  {lang.native}
                </span>
                <span className="text-[10px] text-base-content/40">{lang.label}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-base-200/40 border border-base-300/20">
          <p className="text-xs text-base-content/50">
            {language === "vi"
              ? "ⓘ️ Ngôn ngữ hiện tại: Tiếng Việt. Các thay đổi sẽ áp dụng sau khi tải lại trang."
              : "ⓘ️ Current language: English. Changes will apply after page reload."}
          </p>
        </div>
      </div>
    </div>
  )
}
