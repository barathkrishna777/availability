"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";
import TimezoneSelector from "@/components/TimezoneSelector";
import ConfigPanel from "@/components/ConfigPanel";
import AvailabilityOutput from "@/components/AvailabilityOutput";
import { ExtractResponse } from "@/lib/types";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 320 200" fill="none" className="w-[120px]" aria-hidden="true">
      <rect x="20" y="30" width="280" height="160" rx="16" fill="white" />
      <rect x="20" y="30" width="280" height="36" rx="16" fill="#1D1D1F" />
      <rect x="20" y="50" width="280" height="16" fill="#1D1D1F" />
      <circle cx="42" cy="48" r="5" fill="#FF3B30" />
      <circle cx="58" cy="48" r="5" fill="#FF9500" />
      <circle cx="74" cy="48" r="5" fill="#34C759" />
      <text x="62" y="81" textAnchor="middle" fontSize="8" fontWeight="600" fill="#86868B">M</text>
      <text x="110" y="81" textAnchor="middle" fontSize="8" fontWeight="600" fill="#86868B">T</text>
      <text x="158" y="81" textAnchor="middle" fontSize="8" fontWeight="600" fill="#86868B">W</text>
      <text x="206" y="81" textAnchor="middle" fontSize="8" fontWeight="600" fill="#86868B">T</text>
      <text x="254" y="81" textAnchor="middle" fontSize="8" fontWeight="600" fill="#86868B">F</text>
      <rect x="40" y="90" width="44" height="22" rx="5" fill="#0071E3" opacity="0.15" />
      <rect x="40" y="130" width="44" height="16" rx="5" fill="#0071E3" opacity="0.15" />
      <rect x="88" y="95" width="44" height="30" rx="5" fill="#0071E3" opacity="0.15" />
      <rect x="88" y="150" width="44" height="18" rx="5" fill="#0071E3" opacity="0.15" />
      <rect x="136" y="88" width="44" height="14" rx="5" fill="#0071E3" opacity="0.15" />
      <rect x="136" y="140" width="44" height="24" rx="5" fill="#0071E3" opacity="0.15" />
      <rect x="184" y="100" width="44" height="20" rx="5" fill="#0071E3" opacity="0.15" />
      <rect x="232" y="92" width="44" height="18" rx="5" fill="#0071E3" opacity="0.15" />
      <rect x="232" y="155" width="44" height="14" rx="5" fill="#0071E3" opacity="0.15" />
      <rect x="136" y="108" width="44" height="26" rx="5" fill="#34C759" opacity="0.25" />
      <rect x="184" y="126" width="44" height="38" rx="5" fill="#34C759" opacity="0.25" />
      <rect x="232" y="116" width="44" height="34" rx="5" fill="#34C759" opacity="0.25" />
      <path d="M152 119l4 4 8-8" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M200 143l4 4 8-8" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M248 131l4 4 8-8" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
    <div className="max-w-[680px] mx-auto px-6 py-10 space-y-10">
      {/* Header — compact, inline icon + text */}
      <header className="flex items-center gap-5">
        <CalendarIcon />
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em] text-apple-gray-dark leading-tight">
            Find your free time.
          </h1>
          <p className="mt-1 text-[15px] text-apple-gray-light">
            Upload a calendar screenshot to see available slots.
          </p>
        </div>
      </header>

      {/* Upload */}
      <ImageUploader images={images} onChange={setImages} />

      {/* Timezone */}
      <TimezoneSelector
        sourceTimezone={sourceTimezone}
        targetTimezone={targetTimezone}
        onSourceChange={setSourceTimezone}
        onTargetChange={setTargetTimezone}
      />

      {/* Options + Button */}
      <div className="space-y-6">
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
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-indigo to-apple-blue text-white text-[17px] font-medium tracking-normal hover:opacity-90 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-accent-indigo/20"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Extracting...
            </>
          ) : (
            "Extract Availability"
          )}
        </button>

        {error && (
          <p className="text-[14px] text-apple-red text-center">{error}</p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="pt-4">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-apple-gray-dark mb-6">
            Your availability
          </h2>
          <AvailabilityOutput
            formattedText={result.formattedText}
            eventsFound={result.eventsFound}
            warnings={result.warnings}
          />
        </div>
      )}
    </div>
  );
}
