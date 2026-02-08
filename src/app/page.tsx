"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";
import TimezoneSelector from "@/components/TimezoneSelector";
import ConfigPanel from "@/components/ConfigPanel";
import AvailabilityOutput from "@/components/AvailabilityOutput";
import { ExtractResponse } from "@/lib/types";

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [sourceTimezone, setSourceTimezone] = useState("America/New_York");
  const [targetTimezone, setTargetTimezone] = useState("America/New_York");
  const [workingHoursStart, setWorkingHoursStart] = useState("09:00");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("18:00");
  const [meetingHoursStart, setMeetingHoursStart] = useState("09:00");
  const [meetingHoursEnd, setMeetingHoursEnd] = useState("18:00");
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractResponse | null>(null);

  // Auto-detect browser timezone, snap to nearest major timezone
  useEffect(() => {
    const MAJOR_TZ_VALUES = [
      "Pacific/Honolulu", "America/Anchorage", "America/Los_Angeles",
      "America/Denver", "America/Chicago", "America/New_York",
      "America/Sao_Paulo", "Europe/London", "Europe/Paris",
      "Europe/Helsinki", "Asia/Dubai", "Asia/Kolkata",
      "Asia/Singapore", "Asia/Shanghai", "Asia/Tokyo",
      "Australia/Sydney", "Pacific/Auckland",
    ];
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = MAJOR_TZ_VALUES.includes(browserTz) ? browserTz : "America/New_York";
    setSourceTimezone(match);
    setTargetTimezone(match);
  }, []);

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images,
          sourceTimezone,
          targetTimezone,
          workingHoursStart,
          workingHoursEnd,
          meetingHoursStart,
          meetingHoursEnd,
          includeWeekends,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload calendar screenshots to find your free meeting slots
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-gray-700">
            Calendar screenshots
          </h2>
          <ImageUploader images={images} onChange={setImages} />
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-gray-700">Timezone</h2>
          <TimezoneSelector
            sourceTimezone={sourceTimezone}
            targetTimezone={targetTimezone}
            onSourceChange={setSourceTimezone}
            onTargetChange={setTargetTimezone}
          />
        </section>

        <ConfigPanel
          workingHoursStart={workingHoursStart}
          workingHoursEnd={workingHoursEnd}
          meetingHoursStart={meetingHoursStart}
          meetingHoursEnd={meetingHoursEnd}
          includeWeekends={includeWeekends}
          onWorkingHoursStartChange={setWorkingHoursStart}
          onWorkingHoursEndChange={setWorkingHoursEnd}
          onMeetingHoursStartChange={setMeetingHoursStart}
          onMeetingHoursEndChange={setMeetingHoursEnd}
          onIncludeWeekendsChange={setIncludeWeekends}
        />

        <button
          onClick={handleExtract}
          disabled={images.length === 0 || loading}
          className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Extracting availability...
            </span>
          ) : (
            "Extract Availability"
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <AvailabilityOutput
            formattedText={result.formattedText}
            eventsFound={result.eventsFound}
            warnings={result.warnings}
          />
        )}
      </div>
    </main>
  );
}
