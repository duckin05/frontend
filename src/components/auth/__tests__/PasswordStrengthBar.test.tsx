import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { PasswordStrengthBar } from "../PasswordStrengthBar"

describe("PasswordStrengthBar", () => {
  it("renders nothing when password is empty", () => {
    const { container } = render(<PasswordStrengthBar password="" />)
    expect(container.innerHTML).toBe("")
  })

  it("shows 'Yếu' for weak passwords (score 0-1)", () => {
    render(<PasswordStrengthBar password="ab" />)
    expect(screen.getByText("Yếu")).toBeTruthy()
  })

  it("shows 'Trung bình' for score 2", () => {
    // "abcdef1": length >=6 (+1), digit (+1) => score 2
    render(<PasswordStrengthBar password="abcdef1" />)
    expect(screen.getByText("Trung bình")).toBeTruthy()
  })

  it("shows 'Khá' for score 3", () => {
    // "Abcdef1": length >=6 (+1), mixed case (+1), digit (+1) => score 3
    render(<PasswordStrengthBar password="Abcdef1" />)
    expect(screen.getByText("Khá")).toBeTruthy()
  })

  it("shows 'Mạnh' for score 4", () => {
    // "Ab1!ef": length >=6 (+1), mixed case (+1), digit (+1), special (+1), NOT >=8 => score 4
    render(<PasswordStrengthBar password="Ab1!ef" />)
    expect(screen.getByText("Mạnh")).toBeTruthy()
  })

  it("shows 'Rất mạnh' for score 5", () => {
    // "Abcdef1!g": length >=6 (+1), length >=8 (+1), mixed case (+1), digit (+1), special (+1) => score 5
    render(<PasswordStrengthBar password="Abcdef1!g" />)
    expect(screen.getByText("Rất mạnh")).toBeTruthy()
  })
})
