"use client";

interface TimezoneSelectorProps {
  sourceTimezone: string;
  targetTimezone: string;
  onSourceChange: (tz: string) => void;
  onTargetChange: (tz: string) => void;
}

const MAJOR_TIMEZONES = [
  { value: "Pacific/Honolulu", label: "Hawaii (HST)" },
  { value: "America/Anchorage", label: "Alaska (AKST)" },
  { value: "America/Los_Angeles", label: "Pacific (PST)" },
  { value: "America/Denver", label: "Mountain (MST)" },
  { value: "America/Chicago", label: "Central (CST)" },
  { value: "America/New_York", label: "Eastern (EST)" },
  { value: "America/Sao_Paulo", label: "Brasilia (BRT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Central Europe (CET)" },
  { value: "Europe/Helsinki", label: "Eastern Europe (EET)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Pacific/Auckland", label: "New Zealand (NZST)" },
  { value: "UTC", label: "UTC" },
];

function TimezoneSelect({
  value,
  onChange,
  label,
  id,
}: {
  value: string;
  onChange: (tz: string) => void;
  label: string;
  id: string;
}) {
  return (
    <div className="flex-1">
      <label
        htmlFor={id}
        className="block text-[12px] font-medium text-apple-gray-light uppercase tracking-wider mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-apple-gray-border/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all duration-150 appearance-none"
      >
        {MAJOR_TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function TimezoneSelector({
  sourceTimezone,
  targetTimezone,
  onSourceChange,
  onTargetChange,
}: TimezoneSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5">
      <TimezoneSelect
        id="source-tz"
        label="Calendar timezone"
        value={sourceTimezone}
        onChange={onSourceChange}
      />
      <div className="hidden sm:flex items-end pb-4 text-apple-gray-border">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
      <TimezoneSelect
        id="target-tz"
        label="Convert to"
        value={targetTimezone}
        onChange={onTargetChange}
      />
    </div>
  );
}
