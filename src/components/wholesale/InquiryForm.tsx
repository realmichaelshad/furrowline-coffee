"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import { CheckboxField, SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { headerOffset } from "@/lib/motion/lenis";
import { scrollToElement } from "./scroll";
import { cn } from "@/lib/cn";
import {
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  MESSAGE_MAX,
  VOLUMES,
  VOLUME_OPTIONS,
  WHOLESALE_FIELDS,
  type BusinessType,
  type InquiryCoffee,
  type Volume,
  type WholesaleField,
} from "@/content/wholesale";
import type { WholesaleInput } from "@/lib/wholesale";

/* ==========================================================================
   Wholesale inquiry. Client island; the validator (zod/mini via
   src/lib/wholesale.ts) loads on the first focus inside the form or on
   submit, never with the page.
   - Validates on submit: inline errors on each field, an error summary at
     the top (role=alert) whose links move focus to the field, and focus
     goes to the first invalid field.
   - After that, a field that is showing an error re-validates as it
     changes, so the message clears the moment it's fixed.
   - "Sends" locally (fake latency, no network), then swaps to a success
     panel (role=status) that takes focus and summarises what was sent.
   ========================================================================== */

type Lib = typeof import("@/lib/wholesale");
let lib: Promise<Lib> | undefined;
const loadLib = () => (lib ??= import("@/lib/wholesale"));

export interface CoffeeOption {
  slug: InquiryCoffee;
  name: string;
  notes: string;
  /** Server-rendered bag thumbnail. */
  art: ReactNode;
}

interface Values {
  business: string;
  businessType: BusinessType | "";
  city: string;
  volume: Volume | "";
  name: string;
  email: string;
  phone: string;
  coffees: InquiryCoffee[];
  message: string;
  consent: boolean;
}

type Errors = Partial<Record<WholesaleField, string>>;
type Status = "idle" | "sending" | "done";

const EMPTY: Values = {
  business: "",
  businessType: "",
  city: "",
  volume: "",
  name: "",
  email: "",
  phone: "",
  coffees: [],
  message: "",
  consent: false,
};

const LABELS: Record<WholesaleField, string> = {
  business: "Business name",
  businessType: "Type of business",
  city: "Town or city",
  volume: "Weekly volume",
  name: "Your name",
  email: "Email",
  phone: "Phone",
  coffees: "Coffees",
  message: "Message",
  consent: "Permission to reply",
};

/** The element that takes focus for a field (the first radio or checkbox for groups). */
function fieldId(field: WholesaleField): string {
  if (field === "volume") return `ws-volume-${VOLUMES[0]}`;
  if (field === "coffees") return "ws-coffee-0";
  return `ws-${field}`;
}

/**
 * Focuses a field and scrolls it into view. After a failed submit (`summary`
 * given), the error summary is brought into view with it whenever both fit
 * on screen, so sighted visitors see the list as well as the first problem.
 */
function focusField(field: WholesaleField, summary?: HTMLElement | null) {
  const el = document.getElementById(fieldId(field));
  if (!el) return;
  el.focus({ preventScroll: true });
  const frame = el.closest<HTMLElement>("[data-field]") ?? el;
  if (summary) {
    const room = window.innerHeight - headerOffset() - 48;
    if (frame.getBoundingClientRect().bottom - summary.getBoundingClientRect().top <= room) {
      scrollToElement(summary);
      return;
    }
  }
  scrollToElement(frame);
}

export function InquiryForm({ coffees }: { coffees: CoffeeOption[] }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState<WholesaleField[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [sent, setSent] = useState<WholesaleInput | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ target: WholesaleField | "success"; n: number; summary?: boolean } | null>(
    null,
  );
  const success = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const request = useRef(0);

  // Focus moves after React has committed the new state (errors rendered, success panel mounted).
  useEffect(() => {
    if (!focusRequest) return;
    if (focusRequest.target === "success") {
      const panel = success.current;
      if (!panel) return;
      panel.focus({ preventScroll: true });
      scrollToElement(panel);
      return;
    }
    focusField(focusRequest.target, focusRequest.summary ? summaryRef.current : null);
  }, [focusRequest]);

  const requestFocus = (target: WholesaleField | "success", summary = false) =>
    setFocusRequest({ target, n: ++request.current, summary });

  const revalidate = async (next: Values, field: WholesaleField) => {
    const { validateWholesale } = await loadLib();
    const result = validateWholesale(next);
    const message = result.ok ? undefined : result.errors[field];
    setErrors((prev) => {
      if (prev[field] === message) return prev;
      const copy = { ...prev };
      if (message) copy[field] = message;
      else delete copy[field];
      return copy;
    });
  };

  const update = <K extends keyof Values>(field: K, value: Values[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) void revalidate(next, field);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;
    const { validateWholesale, fakeLatency } = await loadLib();
    const result = validateWholesale(values);
    if (!result.ok) {
      const fields = WHOLESALE_FIELDS.filter((field) => result.errors[field]);
      setErrors(result.errors);
      setSummary(fields);
      if (fields[0]) requestFocus(fields[0], true);
      return;
    }
    setErrors({});
    setSummary([]);
    setStatus("sending");
    await fakeLatency(1100);
    setSent(result.data);
    setStatus("done");
    requestFocus("success");
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setSummary([]);
    setSent(null);
    setStatus("idle");
    requestFocus("business");
  };

  if (status === "done" && sent) {
    return <SuccessPanel ref={success} sent={sent} coffees={coffees} onReset={reset} />;
  }

  const open = summary.filter((field) => errors[field]);
  const sending = status === "sending";
  const count = values.message.trim().length;
  const over = count > MESSAGE_MAX;

  return (
    <form
      noValidate
      aria-labelledby="inquiry-title"
      aria-busy={sending || undefined}
      className="ws-form"
      onSubmit={onSubmit}
      onFocusCapture={() => void loadLib()}
    >
      {open.length > 0 && (
        <div ref={summaryRef} className="ws-summary" role="alert">
          <p className="flex items-center gap-2 font-semibold">
            <Icon name="alert" className="size-5 shrink-0" />
            Before we can send this:
          </p>
          <ul className="mt-3 grid gap-1.5">
            {open.map((field) => (
              <li key={field}>
                <a
                  href={`#${fieldId(field)}`}
                  className="ws-summary-link"
                  data-scroll="manual"
                  onClick={(event) => {
                    event.preventDefault();
                    focusField(field);
                  }}
                >
                  <span className="font-semibold">{LABELS[field]}:</span> {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-micro text-bark">Every field is required unless it says optional.</p>

      <div className="ws-group">
        <h3 className="ws-group-title eyebrow">
          <span aria-hidden="true">01</span> Your business
        </h3>
        <div className="ws-grid">
          <div className="ws-span-2" data-field>
            <TextField
              announce={false}
              id="ws-business"
              label="Business name"
              name="business"
              autoComplete="organization"
              required
              value={values.business}
              error={errors.business}
              onChange={(e) => update("business", e.target.value)}
            />
          </div>
          <div data-field>
            <SelectField
              announce={false}
              id="ws-businessType"
              label="Type of business"
              name="businessType"
              required
              placeholder="Choose one"
              options={BUSINESS_TYPES.map((type) => ({ value: type, label: BUSINESS_TYPE_LABELS[type] }))}
              value={values.businessType}
              error={errors.businessType}
              onChange={(e) => update("businessType", e.target.value as BusinessType)}
            />
          </div>
          <div data-field>
            <TextField
              announce={false}
              id="ws-city"
              label="Town or city"
              name="city"
              autoComplete="address-level2"
              required
              value={values.city}
              error={errors.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
          <fieldset
            className="ws-span-2 min-w-0"
            data-field
            data-invalid={errors.volume ? "" : undefined}
            aria-describedby={errors.volume ? "ws-volume-error" : "ws-volume-hint"}
          >
            <legend className="field-label">Weekly volume</legend>
            <p id="ws-volume-hint" className="field-hint mt-0 mb-3">
              Roughly how much coffee you go through. A guess is fine.
            </p>
            <div className="ws-pills">
              {VOLUMES.map((volume) => (
                <label key={volume} className="choice ws-pill">
                  <input
                    type="radio"
                    id={`ws-volume-${volume}`}
                    name="volume"
                    required
                    value={volume}
                    checked={values.volume === volume}
                    onChange={() => update("volume", volume)}
                  />
                  <span className="text-small font-semibold">{VOLUME_OPTIONS[volume].label}</span>
                  <span className="text-micro opacity-80">{VOLUME_OPTIONS[volume].detail}</span>
                </label>
              ))}
            </div>
            {errors.volume && (
              <p id="ws-volume-error" className="field-error">
                <Icon name="alert" className="mt-px size-4 shrink-0" />
                <span>{errors.volume}</span>
              </p>
            )}
          </fieldset>
        </div>
      </div>

      <div className="ws-group">
        <h3 className="ws-group-title eyebrow">
          <span aria-hidden="true">02</span> About you
        </h3>
        <div className="ws-grid">
          <div data-field>
            <TextField
              announce={false}
              id="ws-name"
              label="Your name"
              name="name"
              autoComplete="name"
              required
              value={values.name}
              error={errors.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div data-field>
            <TextField
              announce={false}
              id="ws-email"
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              hint="We only use it to reply."
              value={values.email}
              error={errors.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
          <div data-field>
            <TextField
              announce={false}
              id="ws-phone"
              label="Phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              optional
              hint="If you'd rather we call."
              value={values.phone}
              error={errors.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="ws-group">
        <h3 className="ws-group-title eyebrow">
          <span aria-hidden="true">03</span> The coffee
        </h3>
        <fieldset className="min-w-0" data-field aria-describedby="ws-coffees-hint">
          <legend className="field-label">
            Coffees you&apos;re interested in <span className="ml-1 font-normal text-bark">(optional)</span>
          </legend>
          <p id="ws-coffees-hint" className="field-hint mt-0 mb-3">
            Pick any and we&apos;ll put them in your sample box.
          </p>
          <div className="ws-coffees">
            {coffees.map((coffee, i) => {
              const checked = values.coffees.includes(coffee.slug);
              return (
                <label key={coffee.slug} className="ws-coffee">
                  <input
                    type="checkbox"
                    id={`ws-coffee-${i}`}
                    name="coffees"
                    value={coffee.slug}
                    checked={checked}
                    onChange={() =>
                      update(
                        "coffees",
                        checked ? values.coffees.filter((slug) => slug !== coffee.slug) : [...values.coffees, coffee.slug],
                      )
                    }
                  />
                  <span className="ws-coffee-art" aria-hidden="true">
                    {coffee.art}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-small font-semibold">{coffee.name}</span>
                    <span className="block text-micro text-bark">{coffee.notes}</span>
                  </span>
                  <span className="ws-coffee-check" aria-hidden="true">
                    <Icon name="check" className="size-3.5" strokeWidth={2.25} />
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="ws-message mt-7" data-field>
          <TextAreaField
            announce={false}
            id="ws-message"
            label="Message"
            name="message"
            optional
            rows={5}
            hint="Your menu, grinder, opening hours: anything that helps us prepare."
            value={values.message}
            error={errors.message}
            onChange={(e) => update("message", e.target.value)}
          />
          <span className={cn("ws-count", over && "ws-count-over")} aria-hidden="true">
            {count.toLocaleString("en-US")} / {MESSAGE_MAX.toLocaleString("en-US")}
          </span>
          <span className="sr-only" aria-live="polite">
            {over ? `Your message is over ${MESSAGE_MAX.toLocaleString("en-US")} characters.` : ""}
          </span>
        </div>
      </div>

      <div className="ws-consent" data-field>
        <CheckboxField
          announce={false}
          id="ws-consent"
          name="consent"
          required
          label="Use my details only to reply to this inquiry."
          checked={values.consent}
          error={errors.consent}
          onChange={(e) => update("consent", e.target.checked)}
        />
      </div>

      <div className="ws-submit">
        <Button type="submit" size="lg" icon={sending ? undefined : "arrow"} aria-disabled={sending || undefined} magnetic>
          {sending ? "Sending…" : "Send inquiry"}
        </Button>
        <p className="text-micro text-bark" aria-live="polite">
          {sending ? "Sending your inquiry…" : "We reply within two working days. Your details are never shared."}
        </p>
      </div>
    </form>
  );
}

function SuccessPanel({
  ref,
  sent,
  coffees,
  onReset,
}: {
  ref: Ref<HTMLDivElement>;
  sent: WholesaleInput;
  coffees: CoffeeOption[];
  onReset: () => void;
}) {
  const firstName = sent.name.split(/\s+/)[0] ?? sent.name;
  const picked = coffees.filter((coffee) => sent.coffees?.includes(coffee.slug));
  const message = sent.message ?? "";
  return (
    <div ref={ref} tabIndex={-1} role="status" className="ws-success outline-none">
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <span className="newsletter-check" aria-hidden="true">
          <Icon name="check" className="size-6" strokeWidth={2} />
        </span>
        <div>
          <h3 className="display text-h2">
            Thanks, {firstName}. <em>It&apos;s with us.</em>
          </h3>
          <p className="mt-3 max-w-[48ch] text-body text-bark">
            We&apos;ll reply within two working days, usually with a few questions about your menu and your grinder, and a date
            for the sample box.
          </p>
        </div>
      </div>

      <dl className="ws-sent">
        <div>
          <dt>Business</dt>
          <dd>
            {sent.business} · {BUSINESS_TYPE_LABELS[sent.businessType]} in {sent.city}
          </dd>
        </div>
        <div>
          <dt>Weekly volume</dt>
          <dd>
            {VOLUME_OPTIONS[sent.volume].label} · {VOLUME_OPTIONS[sent.volume].detail.toLowerCase()}
          </dd>
        </div>
        <div>
          <dt>We&apos;ll reply to</dt>
          <dd>
            {sent.name} · <span data-contact>{sent.email}</span>
            {sent.phone ? (
              <>
                {" "}
                · <span data-contact>{sent.phone}</span>
              </>
            ) : null}
          </dd>
        </div>
        <div>
          <dt>Sample box</dt>
          <dd>{picked.length > 0 ? picked.map((coffee) => coffee.name).join(", ") : "Not sure yet: we'll choose four for your menu"}</dd>
        </div>
        {message && (
          <div className="ws-sent-wide">
            <dt>Message</dt>
            <dd className="italic">“{message.length > 180 ? `${message.slice(0, 180).trimEnd()}…` : message}”</dd>
          </div>
        )}
      </dl>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button variant="outline" size="md" icon="repeat" iconPosition="start" onClick={onReset}>
          Send another inquiry
        </Button>
        <p className="max-w-[40ch] text-micro text-bark">
          Furrowline is a concept roastery, so nothing actually left your browser.
        </p>
      </div>
    </div>
  );
}
