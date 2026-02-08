import { FreeSlot } from "./types";

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDateHeading(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getTimezoneAbbreviation(timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value || timezone;
  } catch {
    return timezone;
  }
}

export function formatAvailability(
  slots: FreeSlot[],
  timezone: string
): string {
  if (slots.length === 0) {
    return "No available time slots found in the specified range.";
  }

  // Group by date
  const byDate = new Map<string, FreeSlot[]>();
  for (const slot of slots) {
    const existing = byDate.get(slot.date) || [];
    existing.push(slot);
    byDate.set(slot.date, existing);
  }

  // Sort dates
  const sortedDates = [...byDate.keys()].sort();

  const lines: string[] = [];

  for (const date of sortedDates) {
    lines.push(formatDateHeading(date));
    const daySlots = byDate.get(date)!;
    // Sort slots by start time
    daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (const slot of daySlots) {
      lines.push(
        `  ${formatTime12h(slot.startTime)} - ${formatTime12h(slot.endTime)}`
      );
    }
    lines.push(""); // blank line between dates
  }

  const abbrev = getTimezoneAbbreviation(timezone);
  const tzLabel = abbrev !== timezone ? `${timezone} (${abbrev})` : timezone;
  lines.push(`All times in ${tzLabel}`);

  return lines.join("\n");
}
