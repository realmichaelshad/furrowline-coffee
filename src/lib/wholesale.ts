import * as z from "zod/mini";
import {
  BUSINESS_TYPES,
  INQUIRY_COFFEES,
  MESSAGE_MAX,
  VOLUMES,
  WHOLESALE_FIELDS,
  type WholesaleField,
} from "@/content/wholesale";
import { emailField, requiredText, validate } from "./forms";

/* ==========================================================================
   Wholesale inquiry validation (zod/mini). The form loads this module on
   first focus or submit, so the validator never ships in the page's
   initial JS. Messages say what's wrong and how to fix it.
   ========================================================================== */

/** Loose phone check: digits with the usual separators, 7 to 15 digits in all. */
const PHONE_CHARS = /^\+?[\d\s().-]+$/;

export function isPlausiblePhone(value: string): boolean {
  if (!PHONE_CHARS.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}

const phoneField = z.optional(
  z
    .string()
    .check(
      z.trim(),
      z.refine((value) => value === "" || isPlausiblePhone(value), "That doesn't look like a phone number. Use digits, spaces and dashes only."),
    ),
);

const messageField = z.optional(
  z.string().check(z.trim(), z.maxLength(MESSAGE_MAX, "Keep the message under 1,000 characters. The details can wait for our reply.")),
);

export const wholesaleSchema = z.object({
  business: requiredText("Tell us the name of your business.", 120),
  name: requiredText("Tell us your name, so we know who to reply to.", 80),
  email: emailField,
  phone: phoneField,
  businessType: z.enum(BUSINESS_TYPES, { error: "Choose the kind of business you run." }),
  volume: z.enum(VOLUMES, { error: "Choose roughly how much coffee you get through a week. A guess is fine." }),
  city: requiredText("Tell us which town or city you're in.", 80),
  coffees: z.optional(z.array(z.enum(INQUIRY_COFFEES, { error: "Pick from the four coffees listed." }))),
  message: messageField,
  consent: z.literal(true, { error: "Tick the box so we can use your details to reply." }),
});

export type WholesaleInput = z.infer<typeof wholesaleSchema>;

/** Re-exported for callers of the validator; wholesale.test.ts checks it matches the schema's keys. */
export { WHOLESALE_FIELDS, type WholesaleField };

export type WholesaleResult =
  | { ok: true; data: WholesaleInput }
  | { ok: false; errors: Partial<Record<WholesaleField, string>> };

/** Validates a raw form payload; returns the trimmed data or one message per field. */
export function validateWholesale(input: unknown): WholesaleResult {
  return validate(wholesaleSchema, input);
}

/** The first field (in on-screen order) that has an error. */
export function firstInvalidField(errors: Partial<Record<WholesaleField, string>>): WholesaleField | undefined {
  return WHOLESALE_FIELDS.find((field) => errors[field]);
}

export { fakeLatency } from "./forms";
