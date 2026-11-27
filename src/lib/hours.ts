/* ==========================================================================
   Opening hours in the café's own time zone.
   Everything works from a real instant (a Date) and Intl.DateTimeFormat with
   an explicit timeZone, so the answer is the same on any server or device:
   a visitor in Berlin sees whether the café in Oregon is open right now.
   Pure functions; the Visit page's client islands call them once a minute.
   ========================================================================== */

/** 0 = Sunday … 6 = Saturday (the JavaScript convention). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DayHours {
  day: Weekday;
  /** "07:00" in 24-hour local time. Omit both for a closed day. */
  open?: string;
  close?: string;
  /** Optional short note shown in the table ("Roast day", "Public cupping at 10"). */
  note?: string;
}

export interface OpenStatus {
  open: boolean;
  /** "Open now · closes at 4 pm" or "Closed · opens Tuesday at 7 am". */
  label: string;
  /** Index into the schedule array for today (local to the café). */
  todayIndex: number;
  /** Real minutes until the next open/close change (DST-aware), or null if the schedule never opens. */
  minutesToChange: number | null;
}

export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const WEEKDAY_SHORT: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/* ---- Time zone helpers ---------------------------------------------------- */

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  weekday: Weekday;
  /** Minutes since local midnight. */
  minutes: number;
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(timeZone, f);
  }
  return f;
}

/** Wall-clock date, weekday and minutes for an instant in a time zone. */
export function zonedParts(date: Date, timeZone: string): ZonedParts {
  const parts: Record<string, string> = {};
  for (const p of formatterFor(timeZone).formatToParts(date)) parts[p.type] = p.value;
  const hour = Number(parts.hour) % 24;
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    weekday: WEEKDAY_SHORT[parts.weekday ?? "Sun"] ?? 0,
    minutes: hour * 60 + Number(parts.minute),
  };
}

/** Offset of local time from UTC in minutes at an instant (e.g. -420 for PDT). */
function offsetMinutes(utcMs: number, timeZone: string): number {
  const p = zonedParts(new Date(utcMs), timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, Math.floor(p.minutes / 60), p.minutes % 60);
  const floored = Math.floor(utcMs / 60000) * 60000;
  return Math.round((asUtc - floored) / 60000);
}

/** The instant (UTC ms) of a local wall-clock time in a time zone. */
export function zonedTimeToUtc(year: number, month: number, day: number, minutes: number, timeZone: string): number {
  const guess = Date.UTC(year, month - 1, day, Math.floor(minutes / 60), minutes % 60);
  const first = guess - offsetMinutes(guess, timeZone) * 60000;
  // Re-check once: the offset can differ on the far side of a DST change.
  const second = guess - offsetMinutes(first, timeZone) * 60000;
  return second;
}

/* ---- Formatting ------------------------------------------------------------ */

/** "07:00" → 420. */
export function parseClock(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** 420 → "7 am", 990 → "4:30 pm", 720 → "12 pm". */
export function formatClock(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const suffix = h24 < 12 ? "am" : "pm";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "7 am – 4 pm", or "Closed". */
export function formatRange(day: DayHours): string {
  if (!day.open || !day.close) return "Closed";
  return `${formatClock(parseClock(day.open))} – ${formatClock(parseClock(day.close))}`;
}

/* ---- Status ---------------------------------------------------------------- */

/** Adds whole days to a calendar date (no time zone involved). */
function addDays(year: number, month: number, day: number, n: number): { year: number; month: number; day: number } {
  const d = new Date(Date.UTC(year, month - 1, day + n));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/**
 * Is the café open at `now`? Opening is inclusive (open at exactly 7:00),
 * closing is exclusive (closed at exactly 16:00).
 */
export function getOpenStatus(now: Date, schedule: DayHours[], timeZone: string): OpenStatus {
  const local = zonedParts(now, timeZone);
  const todayIndex = Math.max(
    0,
    schedule.findIndex((d) => d.day === local.weekday),
  );
  const byDay = new Map(schedule.map((d) => [d.day, d]));
  const minutesUntil = (offsetDays: number, wallMinutes: number) => {
    const date = addDays(local.year, local.month, local.day, offsetDays);
    const at = zonedTimeToUtc(date.year, date.month, date.day, wallMinutes, timeZone);
    return Math.round((at - now.getTime()) / 60000);
  };

  const today = byDay.get(local.weekday);
  if (today?.open && today.close) {
    const open = parseClock(today.open);
    const close = parseClock(today.close);
    if (local.minutes >= open && local.minutes < close) {
      return {
        open: true,
        label: `Open now · closes at ${formatClock(close)}`,
        todayIndex,
        minutesToChange: minutesUntil(0, close),
      };
    }
    if (local.minutes < open) {
      return {
        open: false,
        label: `Closed · opens today at ${formatClock(open)}`,
        todayIndex,
        minutesToChange: minutesUntil(0, open),
      };
    }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const weekday = ((local.weekday + offset) % 7) as Weekday;
    const next = byDay.get(weekday);
    if (!next?.open || !next.close) continue;
    const open = parseClock(next.open);
    const when = offset === 1 ? "tomorrow" : WEEKDAY_NAMES[weekday];
    return {
      open: false,
      label: `Closed · opens ${when} at ${formatClock(open)}`,
      todayIndex,
      minutesToChange: minutesUntil(offset, open),
    };
  }

  return { open: false, label: "Closed", todayIndex, minutesToChange: null };
}
