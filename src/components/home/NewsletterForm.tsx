"use client";

import { useRef, useState } from "react";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { FieldErrors, NewsletterInput } from "@/lib/forms";

/* zod/mini loads on first focus or submit, so it stays out of Home's initial JS. */
type Forms = typeof import("@/lib/forms");
let forms: Promise<Forms> | undefined;
const loadForms = () => (forms ??= import("@/lib/forms"));
type CheckResult = { ok: true } | { ok: false; errors: FieldErrors<NewsletterInput> };

/* ==========================================================================
   Roast-day letters signup. Validates with zod on submit, then live once a
   field has shown an error. "Sends" locally (no network) and swaps to a
   success panel that takes focus so it's announced. While sending, the
   button stays focusable (aria-disabled) and repeat submits are ignored,
   as in the wholesale form.
   ========================================================================== */

type Status = "idle" | "sending" | "done";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const success = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const latest = useRef("");

  const check = async (value: string): Promise<CheckResult> => {
    latest.current = value;
    const { validate, newsletterSchema } = await loadForms();
    const result = validate(newsletterSchema, { email: value });
    // Ignore a stale result if the visitor kept typing while the validator loaded.
    if (latest.current === value) setError(result.ok ? undefined : result.errors.email);
    return result;
  };

  if (status === "done") {
    return (
      <div ref={success} tabIndex={-1} role="status" className="newsletter-success outline-none">
        <span className="newsletter-check" aria-hidden="true">
          <Icon name="check" className="size-6" strokeWidth={2} />
        </span>
        <div>
          <p className="display text-h3">You&apos;re on the list.</p>
          <p className="mt-1 text-small text-bark">
            The first letter goes out on the next roast day. Expect one short note, never more than once a week.
          </p>
          <button
            type="button"
            className="link-sweep mt-4 text-small font-semibold"
            onClick={() => {
              setStatus("idle");
              setEmail("");
              setTouched(false);
              requestAnimationFrame(() => input.current?.focus());
            }}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
      aria-busy={status === "sending" || undefined}
      onSubmit={async (e) => {
        e.preventDefault();
        // Already sending: a second Enter in the field must not submit again.
        if (status !== "idle") return;
        setTouched(true);
        const result = await check(email);
        if (!result.ok) {
          input.current?.focus();
          return;
        }
        setStatus("sending");
        await (await loadForms()).fakeLatency(800);
        setStatus("done");
        requestAnimationFrame(() => success.current?.focus());
      }}
    >
      <TextField
        ref={input}
        label="Email address"
        hideLabel
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder="Your email address"
        value={email}
        error={touched ? error : undefined}
        onChange={(e) => {
          setEmail(e.target.value);
          if (touched) void check(e.target.value);
        }}
        onFocus={() => void loadForms()}
        onBlur={() => touched && void check(email)}
      />
      {/* aria-disabled, not disabled: a natively disabled button drops keyboard focus to <body>. */}
      <Button type="submit" size="md" icon="arrow" className="sm:h-[3.25rem]" aria-disabled={status === "sending" || undefined}>
        {status === "sending" ? "Subscribing…" : "Subscribe"}
      </Button>
      <p className="text-micro text-bark sm:col-span-2">One letter on roast days. Unsubscribe any time. We never share your address.</p>
    </form>
  );
}
