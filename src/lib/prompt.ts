export const SYSTEM_PROMPT = `You are a calendar event extraction assistant. You analyze screenshots of calendars and extract all visible events into structured JSON. You ONLY output valid JSON, no other text.`;

export function buildUserPrompt(imageCount: number): string {
  const today = new Date().toISOString().split("T")[0];
  return `Analyze ${imageCount === 1 ? "this calendar screenshot" : `these ${imageCount} calendar screenshots`} and extract ALL visible events.

Today's date is ${today}. Use this to determine the correct year if the calendar only shows a month and day.

For each event, extract:
- date: in YYYY-MM-DD format
- startTime: in HH:mm 24-hour format
- endTime: in HH:mm 24-hour format
- title: the event name/title if visible

Rules:
- CRITICAL: For weekly/daily calendar views, first identify each column's day and date from the column headers (e.g. "MON 16", "TUE 17"). Then for each event, carefully determine which column it appears in to assign the correct date. Events in different columns belong to different days — do not mix them up.
- When times are printed on an event (e.g. "12:30 – 1:50pm", "2 – 3:50pm"), read those exact times. Do not estimate when the text is legible.
- Include only actual scheduled events (meetings, classes, appointments, interviews, etc.)
- SKIP holidays, observances, and informational entries from subscribed holiday calendars (e.g. "Presidents' Day", "Ramadan Start", "Shivaji Jayanti", "Maha Shivaratri"). These appear as colored banners at the top of the day column and do not represent busy time.
- For actual all-day events (conferences, offsites, etc.), use startTime "00:00" and endTime "23:59"
- For multi-day events, create separate entries for each day
- If an event spans across screenshots, only include it once (deduplicate)
- Use the dates visible on the calendar — do not guess or infer dates not shown
- Identify the full date range visible across all screenshots
- If you cannot read a time precisely, make your best estimate
- If an event's end time is not visible or is cut off, estimate a reasonable duration (typically 1 hour for a meeting, 1.5 hours for a class) rather than assuming it runs to end of day

Respond with ONLY this JSON structure:
{
  "events": [
    {
      "date": "YYYY-MM-DD",
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "title": "Event Name"
    }
  ],
  "dateRange": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "warnings": ["any issues or uncertainties about the extraction"]
}`;
}
