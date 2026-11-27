import { describe, expect, it } from "vitest";
import { newsletterSchema, validate } from "./forms";

describe("newsletter validation", () => {
  it("accepts a valid email and trims it", () => {
    const result = validate(newsletterSchema, { email: "  nadia@example.com " });
    expect(result).toEqual({ ok: true, data: { email: "nadia@example.com" } });
  });

  it("asks for an email when the field is empty", () => {
    const result = validate(newsletterSchema, { email: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBe("Enter your email address.");
  });

  it("explains a malformed email", () => {
    const result = validate(newsletterSchema, { email: "nadia.example.com" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toMatch(/doesn't look like an email/);
  });

  it("reports only the first problem per field", () => {
    const result = validate(newsletterSchema, { email: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toEqual(["email"]);
  });
});
