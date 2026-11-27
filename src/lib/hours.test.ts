import { describe, expect, it } from "vitest";
import { CAFE_TIME_ZONE, HOURS } from "@/content/visit";
import {
  formatClock,
  formatRange,
  getOpenStatus,
  parseClock,
  zonedParts,
  zonedTimeToUtc,
  type DayHours,
} from "./hours";

const TZ = CAFE_TIME_ZONE;
const at = (iso: string) => getOpenStatus(new Date(iso), HOURS, TZ);

/* HOURS (Monday first): Mon closed · Tue-Fri 7-16 · Sat 8-16 · Sun 9-14.
   October 2026 is daylight time in Oregon (UTC-7); DST ends Sun 1 Nov 2026
   and begins Sun 8 Mar 2026 (UTC-8 in between). */

describe("zonedParts", () => {
  it("reads the weekday and time in the café's zone, not UTC", () => {
    // Friday 06:30 UTC is still Thursday evening in Oregon.
    expect(zonedParts(new Date("2026-10-23T06:30:00Z"), TZ)).toMatchObject({ weekday: 4, minutes: 23 * 60 + 30, day: 22 });
    expect(zonedParts(new Date("2026-10-20T14:00:00Z"), TZ)).toMatchObject({ weekday: 2, minutes: 7 * 60 });
  });

  it("follows daylight saving time", () => {
    expect(zonedParts(new Date("2026-03-08T09:59:00Z"), TZ).minutes).toBe(1 * 60 + 59); // 1:59 PST
    expect(zonedParts(new Date("2026-03-08T10:00:00Z"), TZ).minutes).toBe(3 * 60); // 3:00 PDT
    expect(zonedParts(new Date("2026-11-01T09:00:00Z"), TZ).minutes).toBe(1 * 60); // 1:00 PST, the second time
  });

  it("converts local wall-clock times back to instants on both sides of a change", () => {
    expect(new Date(zonedTimeToUtc(2026, 10, 20, 7 * 60, TZ)).toISOString()).toBe("2026-10-20T14:00:00.000Z");
    expect(new Date(zonedTimeToUtc(2026, 11, 3, 7 * 60, TZ)).toISOString()).toBe("2026-11-03T15:00:00.000Z");
    expect(new Date(zonedTimeToUtc(2026, 3, 8, 9 * 60, TZ)).toISOString()).toBe("2026-03-08T16:00:00.000Z");
    expect(new Date(zonedTimeToUtc(2026, 11, 1, 9 * 60, TZ)).toISOString()).toBe("2026-11-01T17:00:00.000Z");
  });
});

describe("getOpenStatus: boundaries", () => {
  it("opens at exactly the opening minute", () => {
    expect(at("2026-10-20T13:59:00Z")).toEqual({
      open: false,
      label: "Closed · opens today at 7 am",
      todayIndex: 1,
      minutesToChange: 1,
    });
    expect(at("2026-10-20T14:00:00Z")).toEqual({
      open: true,
      label: "Open now · closes at 4 pm",
      todayIndex: 1,
      minutesToChange: 9 * 60,
    });
  });

  it("closes at exactly the closing minute", () => {
    expect(at("2026-10-20T22:59:00Z")).toMatchObject({ open: true, minutesToChange: 1 });
    expect(at("2026-10-20T23:00:00Z")).toEqual({
      open: false,
      label: "Closed · opens tomorrow at 7 am",
      todayIndex: 1,
      minutesToChange: 15 * 60,
    });
  });

  it("uses each day's own hours (Saturday 8-16, Sunday 9-14)", () => {
    expect(at("2026-10-24T14:59:00Z")).toMatchObject({ open: false, label: "Closed · opens today at 8 am", todayIndex: 5 });
    expect(at("2026-10-24T15:00:00Z")).toMatchObject({ open: true, label: "Open now · closes at 4 pm" });
    expect(at("2026-10-25T20:59:00Z")).toMatchObject({ open: true, label: "Open now · closes at 2 pm", todayIndex: 6 });
  });
});

describe("getOpenStatus: closed days and rollover", () => {
  it("knows Monday is closed all day and points at Tuesday morning", () => {
    expect(at("2026-10-26T18:00:00Z")).toEqual({
      open: false,
      label: "Closed · opens tomorrow at 7 am",
      todayIndex: 0,
      minutesToChange: 20 * 60,
    });
  });

  it("rolls Sunday evening over the closed Monday to Tuesday", () => {
    expect(at("2026-10-25T21:00:00Z")).toEqual({
      open: false,
      label: "Closed · opens Tuesday at 7 am",
      todayIndex: 6,
      minutesToChange: 41 * 60,
    });
  });

  it("rolls Saturday evening to Sunday's later opening", () => {
    expect(at("2026-10-24T23:30:00Z")).toMatchObject({
      open: false,
      label: "Closed · opens tomorrow at 9 am",
      minutesToChange: 16 * 60 + 30,
    });
  });

  it("treats late evening as the local day even when UTC has moved on", () => {
    expect(at("2026-10-23T06:30:00Z")).toEqual({
      open: false,
      label: "Closed · opens tomorrow at 7 am",
      todayIndex: 3,
      minutesToChange: 7 * 60 + 30,
    });
  });
});

describe("getOpenStatus: daylight saving weeks", () => {
  it("opens at 7 am local before and after the November change", () => {
    expect(at("2026-10-27T14:00:00Z").open).toBe(true); // 07:00 PDT
    expect(at("2026-11-03T14:00:00Z").open).toBe(false); // 06:00 PST
    expect(at("2026-11-03T14:59:00Z")).toMatchObject({ open: false, minutesToChange: 1 });
    expect(at("2026-11-03T15:00:00Z").open).toBe(true); // 07:00 PST
  });

  it("counts real minutes across the night the clocks go back", () => {
    // Saturday 16:00 PDT → Sunday 09:00 PST is 17 wall-clock hours but 18 real ones.
    expect(at("2026-10-31T23:00:00Z")).toMatchObject({
      open: false,
      label: "Closed · opens tomorrow at 9 am",
      minutesToChange: 18 * 60,
    });
  });

  it("counts real minutes across the night the clocks go forward", () => {
    // Saturday 16:00 PST → Sunday 09:00 PDT is 17 wall-clock hours but 16 real ones.
    expect(at("2026-03-08T00:00:00Z")).toMatchObject({ open: false, minutesToChange: 16 * 60 });
    expect(at("2026-03-08T15:59:00Z")).toMatchObject({ open: false, label: "Closed · opens today at 9 am", minutesToChange: 1 });
    expect(at("2026-03-08T16:00:00Z")).toMatchObject({ open: true, label: "Open now · closes at 2 pm" });
  });
});

describe("getOpenStatus: edge schedules", () => {
  it("returns a plain Closed when nothing ever opens", () => {
    const shut: DayHours[] = [0, 1, 2, 3, 4, 5, 6].map((d) => ({ day: d as DayHours["day"] }));
    expect(getOpenStatus(new Date("2026-10-20T18:00:00Z"), shut, TZ)).toEqual({
      open: false,
      label: "Closed",
      todayIndex: 2,
      minutesToChange: null,
    });
  });

  it("finds a day a week away when only one day opens", () => {
    const tuesdays: DayHours[] = [{ day: 2, open: "07:00", close: "16:00" }];
    expect(getOpenStatus(new Date("2026-10-20T23:30:00Z"), tuesdays, TZ)).toMatchObject({
      label: "Closed · opens Tuesday at 7 am",
      minutesToChange: 7 * 24 * 60 - 30 - 9 * 60,
    });
  });
});

describe("formatting", () => {
  it("formats clock times the way people say them", () => {
    expect(formatClock(420)).toBe("7 am");
    expect(formatClock(990)).toBe("4:30 pm");
    expect(formatClock(720)).toBe("12 pm");
    expect(formatClock(0)).toBe("12 am");
    expect(formatClock(1439)).toBe("11:59 pm");
    expect(parseClock("16:00")).toBe(960);
  });

  it("formats a day's range or Closed", () => {
    expect(formatRange({ day: 2, open: "07:00", close: "16:00" })).toBe("7 am – 4 pm");
    expect(formatRange({ day: 1 })).toBe("Closed");
  });
});
