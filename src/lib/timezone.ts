import { FreeSlot } from "./types";

function parseDateTime(date: string, time: string, timezone: string): Date {
  // Build an ISO-ish string and use Intl to figure out the UTC offset
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Create a formatter that gives us the UTC offset for this timezone at this date/time
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset",
  });

  // We need to find what UTC time corresponds to the given local time in the given timezone.
  // Strategy: start with a rough guess, then adjust.
  const guess = new Date(
    Date.UTC(year, month - 1, day, hour, minute)
  );

  // Format the guess in the target timezone to see what local time it maps to
  const parts = formatter.formatToParts(guess);
  const getPart = (type: string) =>
    parts.find((p) => p.type === type)?.value || "0";

  const guessLocalHour = parseInt(getPart("hour"));
  const guessLocalMinute = parseInt(getPart("minute"));
  const guessLocalDay = parseInt(getPart("day"));
  const guessLocalMonth = parseInt(getPart("month"));

  // Calculate the difference between what we want and what we got
  const wantedMinutes = hour * 60 + minute;
  const gotMinutes = guessLocalHour * 60 + guessLocalMinute;
  let diffMinutes = wantedMinutes - gotMinutes;

  // Handle day boundary
  if (guessLocalDay !== day || guessLocalMonth !== month) {
    // Day shifted, adjust by a day's worth of minutes
    const dayDiff =
      day -
      guessLocalDay +
      (month !== guessLocalMonth ? (month > guessLocalMonth ? 30 : -30) : 0);
    diffMinutes += dayDiff * 24 * 60;
  }

  // Adjust the guess
  return new Date(guess.getTime() - diffMinutes * 60 * 1000);
}

function formatTimeInTimezone(date: Date, timezone: string): { date: string; time: string } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dateStr = formatter.format(date); // YYYY-MM-DD from en-CA
  const timeStr = timeFormatter.format(date); // HH:mm from en-GB

  return { date: dateStr, time: timeStr };
}

export function convertSlots(
  slots: FreeSlot[],
  sourceTimezone: string,
  targetTimezone: string
): FreeSlot[] {
  if (sourceTimezone === targetTimezone) return slots;

  const converted: FreeSlot[] = [];

  for (const slot of slots) {
    const startUTC = parseDateTime(slot.date, slot.startTime, sourceTimezone);
    const endUTC = parseDateTime(slot.date, slot.endTime, sourceTimezone);

    const start = formatTimeInTimezone(startUTC, targetTimezone);
    const end = formatTimeInTimezone(endUTC, targetTimezone);

    if (start.date === end.date) {
      // Same day — simple case
      converted.push({
        date: start.date,
        startTime: start.time,
        endTime: end.time,
      });
    } else {
      // Midnight crossing — split into two slots
      converted.push({
        date: start.date,
        startTime: start.time,
        endTime: "23:59",
      });
      converted.push({
        date: end.date,
        startTime: "00:00",
        endTime: end.time,
      });
    }
  }

  return converted;
}
