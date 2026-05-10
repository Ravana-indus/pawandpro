import { describe, expect, it } from "vitest"

import {
  parseAdminPagination,
  parseAdminSort,
  totalPages,
} from "./pagination"

describe("parseAdminPagination", () => {
  it("parses valid page and perPage values", () => {
    expect(parseAdminPagination({ page: "2", perPage: "25" })).toEqual({
      page: 2,
      perPage: 25,
      from: 25,
      to: 49,
    })
  })

  it("normalizes invalid page and clamps perPage", () => {
    expect(parseAdminPagination({ page: "-1", perPage: "999" })).toEqual({
      page: 1,
      perPage: 100,
      from: 0,
      to: 99,
    })
  })
})

describe("totalPages", () => {
  it("calculates total pages and floors to a minimum of 1", () => {
    expect(totalPages(250, 25)).toBe(10)
    expect(totalPages(0, 25)).toBe(1)
  })
})

describe("parseAdminSort", () => {
  const allowed = ["created_at", "email"] as const

  it("accepts whitelisted sort fields", () => {
    expect(parseAdminSort("email", allowed, "created_at")).toBe("email")
  })

  it("falls back for non-whitelisted sort fields", () => {
    expect(parseAdminSort("status", allowed, "created_at")).toBe("created_at")
  })
})
