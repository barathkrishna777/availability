import { NextResponse } from "next/server";
import { ExtractRequest, ExtractResponse } from "@/lib/types";
import { extractEvents } from "@/lib/claude";
import { computeFreeSlots, clampToMeetingHours } from "@/lib/availability";
import { convertSlots } from "@/lib/timezone";
import { formatAvailability } from "@/lib/format";

export const maxDuration = 60;

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in base64 chars (rough)

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const body: ExtractRequest = await request.json();

    // Validate images
    if (!body.images || body.images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (body.images.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_IMAGES} images allowed` },
        { status: 400 }
      );
    }

    for (let i = 0; i < body.images.length; i++) {
      if (body.images[i].length > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: `Image ${i + 1} exceeds the 5MB size limit` },
          { status: 400 }
        );
      }
    }

    // Validate timezones
    if (!body.sourceTimezone || !body.targetTimezone) {
      return NextResponse.json(
        { error: "Source and target timezones are required" },
        { status: 400 }
      );
    }

    // Extract events from images
    const extraction = await extractEvents(body.images);

    // Compute free slots (full day range in source timezone)
    const freeSlots = computeFreeSlots(
      extraction.events,
      extraction.dateRange,
      body.includeWeekends ?? false
    );

    // Convert timezones
    const converted = convertSlots(
      freeSlots,
      body.sourceTimezone,
      body.targetTimezone
    );

    // Clamp to meeting hours in the target timezone
    const clamped = clampToMeetingHours(
      converted,
      body.meetingHoursStart || "09:00",
      body.meetingHoursEnd || "18:00"
    );

    // Format output
    const formattedText = formatAvailability(clamped, body.targetTimezone);

    const response: ExtractResponse = {
      availability: clamped,
      formattedText,
      eventsFound: extraction.events.length,
      warnings: extraction.warnings || [],
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const err = error as Error & { status?: number; error?: { type?: string } };

    // Anthropic API errors
    if (err.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your ANTHROPIC_API_KEY." },
        { status: 401 }
      );
    }
    if (err.status === 429) {
      return NextResponse.json(
        { error: "Rate limited. Please try again in a moment." },
        { status: 429 }
      );
    }
    if (err.message?.includes("Failed to parse")) {
      return NextResponse.json(
        {
          error:
            "Could not extract calendar events from the image. Please try a clearer screenshot.",
        },
        { status: 422 }
      );
    }

    console.error("Extract API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
