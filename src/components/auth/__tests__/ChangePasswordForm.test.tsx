import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ChangePasswordForm } from "../ChangePasswordForm"

const mockChangePassword = vi.hoisted(() => vi.fn())

vi.mock("../../../hooks/useProfile", () => ({
  useProfile: () => ({
    changePassword: mockChangePassword,
    isLoading: false,
  }),
}))

function setup() {
  const view = render(<ChangePasswordForm />)
  const inputs = view.container.querySelectorAll<HTMLInputElement>('input[type="password"]')
  return {
    oldPassword: inputs[0],
    newPassword: inputs[1],
    confirmPassword: inputs[2],
    submitButton: screen.getByRole("button", { name: /đổi mật khẩu/i }),
    container: view.container,
  }
}

describe("ChangePasswordForm", () => {
  beforeEach(() => {
    mockChangePassword.mockReset()
  })

  it("renders all three password fields and submit button", () => {
    const fields = setup()
    expect(fields.oldPassword).toBeTruthy()
    expect(fields.newPassword).toBeTruthy()
    expect(fields.confirmPassword).toBeTruthy()
    expect(fields.submitButton).toBeTruthy()
  })

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup()
    const fields = setup()
    await user.click(fields.submitButton)
    await waitFor(() => {
      expect(fields.container.textContent).toMatch(/mật khẩu hiện tại/i)
    })
  })

  it("shows confirm password mismatch error", async () => {
    const user = userEvent.setup()
    const fields = setup()
    await user.type(fields.oldPassword, "OldPass1")
    await user.type(fields.newPassword, "NewValid1#")
    await user.type(fields.confirmPassword, "Different1#")
    await user.click(fields.submitButton)
    await waitFor(() => {
      expect(fields.container.textContent).toMatch(/không khớp/i)
    })
  })

  it("shows success alert on valid submission", async () => {
    mockChangePassword.mockResolvedValue({ success: true })
    const user = userEvent.setup()
    const fields = setup()
    await user.type(fields.oldPassword, "OldPass1")
    await user.type(fields.newPassword, "NewValid1#")
    await user.type(fields.confirmPassword, "NewValid1#")
    await user.click(fields.submitButton)
    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith("OldPass1", "NewValid1#")
      // Check success alert appears via its CSS class (avoids Unicode issues)
      const successAlert = fields.container.querySelector(".alert-success")
      expect(successAlert).toBeTruthy()
    })
  })

  it("shows server error when changePassword fails", async () => {
    mockChangePassword.mockResolvedValue({ success: false, message: "Sai mật khẩu cũ" })
    const user = userEvent.setup()
    const fields = setup()
    await user.type(fields.oldPassword, "WrongOld1")
    await user.type(fields.newPassword, "NewValid1#")
    await user.type(fields.confirmPassword, "NewValid1#")
    await user.click(fields.submitButton)
    await waitFor(() => {
      expect(fields.container.textContent).toMatch(/sai mật khẩu cũ/i)
    })
  })

  it("shows password strength bar when typing new password", async () => {
    const user = userEvent.setup()
    const fields = setup()
    await user.type(fields.newPassword, "weak")
    expect(fields.container.textContent).toMatch(/yếu/i)
  })
})
