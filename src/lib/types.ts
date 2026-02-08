export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  title?: string;
}

export interface ExtractionResult {
  events: CalendarEvent[];
  dateRange: {
    start: string; // YYYY-MM-DD
    end: string; // YYYY-MM-DD
  };
  warnings: string[];
}

export interface FreeSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
}

export interface ExtractRequest {
  images: string[]; // base64 encoded
  sourceTimezone: string; // IANA timezone
  targetTimezone: string; // IANA timezone
  meetingHoursStart: string; // HH:mm (24h)
  meetingHoursEnd: string; // HH:mm (24h)
  includeWeekends: boolean;
}

export interface ExtractResponse {
  availability: FreeSlot[];
  formattedText: string;
  eventsFound: number;
  warnings: string[];
}
