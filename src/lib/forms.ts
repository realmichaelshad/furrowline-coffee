import * as z from "zod/mini";

/* ==========================================================================
   Shared form validation, built on zod/mini (the tree-shakable build, a few
   KB in the client bundle instead of the full zod). Messages are written
   for people, not parsers: say what's wrong and how to fix it. Forms
   validate on submit, then re-validate a field on blur/change once it has
   shown an error. Nothing is ever sent over the network in this concept.

   Writing a schema:  z.object({ name: requiredText("Tell us your name."),
                                 email: emailField, notes: z.optional(z.string()) })
   Then: const result = validate(schema, values) → { ok, data } | { ok, errors }
   ========================================================================== */

// Practical email check (same spirit as the browser's input[type=email]).
const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

/** A required, trimmed string with a friendly empty-field message. */
export function requiredText(message: string, max = 500) {
  return z.string().check(z.trim(), z.minLength(1, message), z.maxLength(max, `Keep it under ${max} characters.`));
}

export const emailField = z
  .string()
  .check(
    z.trim(),
    z.minLength(1, "Enter your email address."),
    z.maxLength(254, "That email address is too long."),
    z.regex(EMAIL, "That doesn't look like an email address. Check for a missing @ or dot."),
  );

export const newsletterSchema = z.object({
  email: emailField,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

/** Validates `data`; returns the parsed value or the first message per field. */
export function validate<S extends z.ZodMiniType>(
  schema: S,
  data: unknown,
): { ok: true; data: z.infer<S> } | { ok: false; errors: FieldErrors<z.infer<S>> } {
  const result = schema.safeParse(data);
  if (result.success) return { ok: true, data: result.data as z.infer<S> };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors: errors as FieldErrors<z.infer<S>> };
}

/** Resolves after `ms`, to make a local submit feel considered (no network). */
export function fakeLatency(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
