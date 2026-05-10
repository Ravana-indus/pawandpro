import type { AdminActionResult } from "./types"

export function ok<T>(data?: T): AdminActionResult<T> {
  return data === undefined ? { success: true } : { success: true, data }
}

export function fail(
  error: string,
  fieldErrors?: Record<string, string[]>,
): AdminActionResult<never> {
  return { success: false, error, fieldErrors }
}
