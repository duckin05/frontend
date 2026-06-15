import { describe, it, expect } from "vitest"
import { changePasswordSchema } from "../validation"

describe("changePasswordSchema", () => {
  it("rejects empty old_password", () => {
    const result = changePasswordSchema.safeParse({
      old_password: "",
      new_password: "Valid1#",
      confirm_password: "Valid1#",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("old_password")
    }
  })

  it("rejects new_password shorter than 6 characters", () => {
    const result = changePasswordSchema.safeParse({
      old_password: "OldPass1",
      new_password: "Abc12",
      confirm_password: "Abc12",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("new_password"))
      expect(issue).toBeDefined()
      expect(issue!.message).toContain("6")
    }
  })

  it("rejects empty confirm_password", () => {
    const result = changePasswordSchema.safeParse({
      old_password: "OldPass1",
      new_password: "Valid1#",
      confirm_password: "",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("confirm_password")
    }
  })

  it("rejects when confirm_password does not match new_password", () => {
    const result = changePasswordSchema.safeParse({
      old_password: "OldPass1",
      new_password: "Valid1#",
      confirm_password: "Different1#",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("confirm_password"))
      expect(issue).toBeDefined()
      expect(issue!.message).toContain("không khớp")
    }
  })

  it("passes with valid data", () => {
    const result = changePasswordSchema.safeParse({
      old_password: "OldPass1",
      new_password: "NewValid1#",
      confirm_password: "NewValid1#",
    })
    expect(result.success).toBe(true)
  })
})
