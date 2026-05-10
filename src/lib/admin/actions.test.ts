import { describe, expect, it } from "vitest"

import { fail, ok } from "./actions"

describe("ok", () => {
  it("returns success with no data payload when data is undefined", () => {
    expect(ok()).toEqual({ success: true })
  })

  it("returns success with a data payload when provided", () => {
    expect(ok({ id: "1" })).toEqual({ success: true, data: { id: "1" } })
  })
})

describe("fail", () => {
  it("returns a failed action result with error only", () => {
    expect(fail("Something went wrong")).toEqual({
      success: false,
      error: "Something went wrong",
      fieldErrors: undefined,
    })
  })

  it("returns a failed action result with fieldErrors", () => {
    expect(
      fail("Validation failed", {
        email: ["Invalid email"],
      }),
    ).toEqual({
      success: false,
      error: "Validation failed",
      fieldErrors: {
        email: ["Invalid email"],
      },
    })
  })
})
