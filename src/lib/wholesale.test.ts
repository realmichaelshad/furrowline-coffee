import { describe, expect, it } from "vitest";
import { MESSAGE_MAX } from "@/content/wholesale";
import {
  WHOLESALE_FIELDS,
  firstInvalidField,
  isPlausiblePhone,
  validateWholesale,
  wholesaleSchema,
  type WholesaleInput,
} from "@/lib/wholesale";

const valid = {
  business: "Tin Cup Café",
  name: "Mara Torres",
  email: "mara@example.com",
  phone: "",
  businessType: "cafe",
  volume: "5-15",
  city: "Alder Bend",
  coffees: ["deep-field", "first-light"],
  message: "Two-group machine, about 90 drinks a day.",
  consent: true,
};

function errorsFor(input: unknown) {
  const result = validateWholesale(input);
  if (result.ok) throw new Error("expected the payload to be rejected");
  return result.errors;
}

describe("wholesale inquiry validation", () => {
  it("accepts a full valid payload", () => {
    const result = validateWholesale(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const data: WholesaleInput = result.data;
      expect(data.business).toBe("Tin Cup Café");
      expect(data.coffees).toEqual(["deep-field", "first-light"]);
      expect(data.consent).toBe(true);
    }
  });

  it("asks for every required field when the form is empty", () => {
    const errors = errorsFor({
      business: "",
      name: "",
      email: "",
      phone: "",
      businessType: "",
      volume: "",
      city: "",
      coffees: [],
      message: "",
      consent: false,
    });
    expect(Object.keys(errors).sort()).toEqual(["business", "businessType", "city", "consent", "email", "name", "volume"]);
    expect(errors.business).toBe("Tell us the name of your business.");
    expect(errors.email).toBe("Enter your email address.");
    expect(errors.volume).toMatch(/A guess is fine/);
  });

  it("treats whitespace-only text as empty and trims what it keeps", () => {
    expect(errorsFor({ ...valid, name: "   ", city: "\t" })).toMatchObject({
      name: expect.stringMatching(/your name/),
      city: expect.stringMatching(/town or city/),
    });
    const result = validateWholesale({ ...valid, business: "  Tin Cup Café  ", email: " mara@example.com ", phone: " (555) 010-0000 " });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.business).toBe("Tin Cup Café");
      expect(result.data.email).toBe("mara@example.com");
      expect(result.data.phone).toBe("(555) 010-0000");
    }
  });

  it("explains a malformed email", () => {
    expect(errorsFor({ ...valid, email: "mara.example.com" }).email).toMatch(/doesn't look like an email/);
    expect(errorsFor({ ...valid, email: "mara@example" }).email).toMatch(/doesn't look like an email/);
  });

  it("rejects values outside the business type and volume lists", () => {
    const errors = errorsFor({ ...valid, businessType: "bakery", volume: "100kg" });
    expect(errors.businessType).toBe("Choose the kind of business you run.");
    expect(errors.volume).toMatch(/how much coffee/);
    expect(errorsFor({ ...valid, coffees: ["house-blend"] }).coffees).toBe("Pick from the four coffees listed.");
  });

  it("caps the message at 1,000 characters", () => {
    expect(validateWholesale({ ...valid, message: "a".repeat(MESSAGE_MAX) }).ok).toBe(true);
    expect(errorsFor({ ...valid, message: "a".repeat(MESSAGE_MAX + 1) }).message).toMatch(/under 1,000 characters/);
    // Surrounding whitespace doesn't count against the limit.
    expect(validateWholesale({ ...valid, message: ` ${"a".repeat(MESSAGE_MAX)}  ` }).ok).toBe(true);
  });

  it("requires consent to reply", () => {
    expect(errorsFor({ ...valid, consent: false }).consent).toBe("Tick the box so we can use your details to reply.");
    expect(errorsFor({ ...valid, consent: "yes" }).consent).toBeDefined();
  });

  it("keeps phone and message optional but checks a phone when given", () => {
    const { phone: _phone, message: _message, coffees: _coffees, ...required } = valid;
    expect(validateWholesale(required).ok).toBe(true);
    expect(validateWholesale({ ...valid, phone: "+1 555 010 0000" }).ok).toBe(true);
    expect(errorsFor({ ...valid, phone: "call after 3" }).phone).toMatch(/phone number/);
    expect(errorsFor({ ...valid, phone: "12-34" }).phone).toMatch(/phone number/);
  });

  it("reports the first invalid field in on-screen order", () => {
    const errors = errorsFor({ ...valid, consent: false, email: "", volume: "" });
    expect(firstInvalidField(errors)).toBe("volume");
    expect(firstInvalidField({})).toBeUndefined();
  });
});

describe("wholesale field order", () => {
  it("lists every field the schema validates, each once", () => {
    expect([...WHOLESALE_FIELDS].sort()).toEqual(Object.keys(wholesaleSchema.shape).sort());
    expect(new Set(WHOLESALE_FIELDS).size).toBe(WHOLESALE_FIELDS.length);
  });
});

describe("isPlausiblePhone", () => {
  it("accepts common formats and rejects letters or too few digits", () => {
    expect(isPlausiblePhone("(555) 010-0000")).toBe(true);
    expect(isPlausiblePhone("555.010.0000")).toBe(true);
    expect(isPlausiblePhone("+44 20 7946 0000")).toBe(true);
    expect(isPlausiblePhone("555-CAFE")).toBe(false);
    expect(isPlausiblePhone("12345")).toBe(false);
    expect(isPlausiblePhone("1".repeat(16))).toBe(false);
  });
});
