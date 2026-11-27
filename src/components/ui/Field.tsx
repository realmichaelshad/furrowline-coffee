import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/* ==========================================================================
   Form fields with label, hint and inline error wired up for assistive tech
   (aria-invalid + aria-describedby). Validation itself lives with the form
   (zod schemas); these components only render state.
   ========================================================================== */

interface FieldShellProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  className?: string;
  optional?: boolean;
  onDark?: boolean;
  /**
   * Announce the inline error as it appears (role="alert"). Forms that show an
   * error summary pass false so a screen reader hears the errors once, from the
   * summary; the error stays linked to its field through aria-describedby.
   */
  announce?: boolean;
}

/** The hint gives way to the error, so describedBy only ever points at what is rendered. */
function ids(base: string, hint?: ReactNode, error?: string) {
  const hintId = hint ? `${base}-hint` : undefined;
  const errorId = error ? `${base}-error` : undefined;
  return { hintId, errorId, describedBy: (errorId ?? hintId) || undefined };
}

function Shell({
  id,
  label,
  hint,
  error,
  hideLabel,
  className,
  optional,
  onDark,
  announce = true,
  hintId,
  errorId,
  children,
}: FieldShellProps & { id: string; hintId?: string; errorId?: string; children: ReactNode }) {
  return (
    <div className={cn("field", className)}>
      <label htmlFor={id} className={cn("field-label", hideLabel && "sr-only")}>
        {label}
        {optional && <span className={cn("ml-1.5 font-normal", onDark ? "text-mist" : "text-bark")}>(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="field-error" role={announce ? "alert" : undefined}>
          <Icon name="alert" className="mt-px size-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className={cn("field-hint", onDark && "text-mist")}>
          {hint}
        </p>
      )}
    </div>
  );
}

type InputProps = FieldShellProps & Omit<ComponentProps<"input">, "className">;

export function TextField({ label, hint, error, hideLabel, className, optional, onDark, announce, id: idProp, ...rest }: InputProps) {
  const auto = useId();
  const id = idProp ?? auto;
  const { hintId, errorId, describedBy } = ids(id, hint, error);
  return (
    <Shell {...{ id, label, hint, error, hideLabel, className, optional, onDark, announce, hintId, errorId }}>
      <input
        id={id}
        className={cn("input", onDark && "input-on-dark")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
    </Shell>
  );
}

type TextAreaProps = FieldShellProps & Omit<ComponentProps<"textarea">, "className">;

export function TextAreaField({ label, hint, error, hideLabel, className, optional, onDark, announce, id: idProp, ...rest }: TextAreaProps) {
  const auto = useId();
  const id = idProp ?? auto;
  const { hintId, errorId, describedBy } = ids(id, hint, error);
  return (
    <Shell {...{ id, label, hint, error, hideLabel, className, optional, onDark, announce, hintId, errorId }}>
      <textarea
        id={id}
        className={cn("input", onDark && "input-on-dark")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
    </Shell>
  );
}

type SelectProps = FieldShellProps &
  Omit<ComponentProps<"select">, "className"> & { options: Array<{ value: string; label: string }>; placeholder?: string };

export function SelectField({
  label,
  hint,
  error,
  hideLabel,
  className,
  optional,
  onDark,
  announce,
  id: idProp,
  options,
  placeholder,
  ...rest
}: SelectProps) {
  const auto = useId();
  const id = idProp ?? auto;
  const { hintId, errorId, describedBy } = ids(id, hint, error);
  return (
    <Shell {...{ id, label, hint, error, hideLabel, className, optional, onDark, announce, hintId, errorId }}>
      <select
        id={id}
        className={cn("input", onDark && "input-on-dark")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}

/** Checkbox with label to the right. */
export function CheckboxField({
  label,
  error,
  className,
  announce = true,
  id: idProp,
  ...rest
}: { label: ReactNode; error?: string; className?: string; announce?: boolean } & Omit<
  ComponentProps<"input">,
  "className" | "type"
>) {
  const auto = useId();
  const id = idProp ?? auto;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-small">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 size-5 shrink-0 accent-[var(--color-clay)]"
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={errorId} className="field-error" role={announce ? "alert" : undefined}>
          <Icon name="alert" className="mt-px size-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
