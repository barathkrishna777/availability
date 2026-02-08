import { CalendarEvent, FreeSlot } from "./types";

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function isWeekend(dateStr: string): boolean {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDay();
  return day === 0 || day === 6;
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start + "T12:00:00");
  const endDate = new Date(end + "T12:00:00");

  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

interface BusyBlock {
  start: number; // minutes from midnight
  end: number;
}

function mergeBlocks(blocks: BusyBlock[]): BusyBlock[] {
  if (blocks.length === 0) return [];

  const sorted = [...blocks].sort((a, b) => a.start - b.start);
  const merged: BusyBlock[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (sorted[i].start <= last.end) {
      last.end = Math.max(last.end, sorted[i].end);
    } else {
      merged.push(sorted[i]);
    }
  }

  return merged;
}

const MIN_SLOT_MINUTES = 15;

export function clampToMeetingHours(
  slots: FreeSlot[],
  meetingHoursStart: string,
  meetingHoursEnd: string
): FreeSlot[] {
  const startMin = timeToMinutes(meetingHoursStart);
  const endMin = timeToMinutes(meetingHoursEnd);

  const clamped: FreeSlot[] = [];
  for (const slot of slots) {
    const slotStart = Math.max(timeToMinutes(slot.startTime), startMin);
    const slotEnd = Math.min(timeToMinutes(slot.endTime), endMin);
    if (slotEnd - slotStart >= MIN_SLOT_MINUTES) {
      clamped.push({
        date: slot.date,
        startTime: minutesToTime(slotStart),
        endTime: minutesToTime(slotEnd),
      });
    }
  }
  return clamped;
}

export function computeFreeSlots(
  events: CalendarEvent[],
  dateRange: { start: string; end: string },
  includeWeekends: boolean
): FreeSlot[] {
  const startMinutes = 0;
  const endMinutes = 24 * 60;
  const dates = getDatesInRange(dateRange.start, dateRange.end);

  // Group events by date
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const existing = eventsByDate.get(event.date) || [];
    existing.push(event);
    eventsByDate.set(event.date, existing);
  }

  const freeSlots: FreeSlot[] = [];

  for (const date of dates) {
    if (!includeWeekends && isWeekend(date)) continue;

    const dayEvents = eventsByDate.get(date) || [];

    // Convert events to busy blocks (clamped to meeting hours)
    const busyBlocks: BusyBlock[] = dayEvents
      .map((e) => ({
        start: Math.max(timeToMinutes(e.startTime), startMinutes),
        end: Math.min(timeToMinutes(e.endTime), endMinutes),
      }))
      .filter((b) => b.start < b.end); // discard events outside meeting hours

    const merged = mergeBlocks(busyBlocks);

    // Find gaps
    let cursor = startMinutes;
    for (const block of merged) {
      if (block.start > cursor) {
        const gap = block.start - cursor;
        if (gap >= MIN_SLOT_MINUTES) {
          freeSlots.push({
            date,
            startTime: minutesToTime(cursor),
            endTime: minutesToTime(block.start),
          });
        }
      }
      cursor = Math.max(cursor, block.end);
    }

    // Gap after last busy block
    if (cursor < endMinutes) {
      const gap = endMinutes - cursor;
      if (gap >= MIN_SLOT_MINUTES) {
        freeSlots.push({
          date,
          startTime: minutesToTime(cursor),
          endTime: minutesToTime(endMinutes),
        });
      }
    }
  }

  return freeSlots;
}
