"use client";

import { HOURS } from "@/content/visit";
import { WEEKDAY_NAMES, formatRange } from "@/lib/hours";
import { cn } from "@/lib/cn";
import { useOpenStatus } from "./useOpenStatus";

/* The week at a glance. The full table is in the static HTML; once mounted,
   today's row (in Oregon) fills in espresso and says whether we're open. */
export function HoursTable() {
  const status = useOpenStatus();
  return (
    <table className="hours-table">
      <caption className="sr-only">Café opening hours, Pacific time</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Hours</th>
          <th scope="col">Notes</th>
        </tr>
      </thead>
      <tbody>
        {HOURS.map((day, i) => {
          const today = status?.todayIndex === i;
          const closed = !day.open;
          return (
            <tr key={day.day} className={cn("hours-row", closed && "is-closed")} data-today={today || undefined}>
              <th scope="row" className="hours-day">
                <span className="display">{WEEKDAY_NAMES[day.day]}</span>
                {today && (
                  <span className="hours-today">
                    Today<span className="sr-only">, {status?.open ? "open now" : "closed now"}</span>
                  </span>
                )}
              </th>
              <td className="hours-time">{formatRange(day)}</td>
              <td className="hours-note">{day.note ?? ""}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
