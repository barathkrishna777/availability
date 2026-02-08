export const SYSTEM_PROMPT = `You are a calendar event extraction assistant. You analyze screenshots of calendars and extract all visible events into structured JSON. You ONLY output valid JSON, no other text.`;

export function buildUserPrompt(imageCount: number): string {
  return `Analyze ${imageCount === 1 ? "this calendar screenshot" : `these ${imageCount} calendar screenshots`} and extract ALL visible events.

For each event, extract:
- date: in YYYY-MM-DD format
- startTime: in HH:mm 24-hour format
- endTime: in HH:mm 24-hour format
- title: the event name/title if visible

Rules:
- Include ALL events you can see, even partially visible ones
- For all-day events, use startTime "00:00" and endTime "23:59"
- For multi-day events, create separate entries for each day
- If an event spans across screenshots, only include it once (deduplicate)
- Use the dates visible on the calendar — do not guess or infer dates not shown
- Identify the full date range visible across all screenshots
- If you cannot read a time precisely, make your best estimate

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
