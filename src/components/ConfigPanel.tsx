"use client";

import { useState } from "react";

interface ConfigPanelProps {
  workingHoursStart: string;
  workingHoursEnd: string;
  meetingHoursStart: string;
  meetingHoursEnd: string;
  includeWeekends: boolean;
  onWorkingHoursStartChange: (value: string) => void;
  onWorkingHoursEndChange: (value: string) => void;
  onMeetingHoursStartChange: (value: string) => void;
  onMeetingHoursEndChange: (value: string) => void;
  onIncludeWeekendsChange: (value: boolean) => void;
}

export default function ConfigPanel({
  workingHoursStart,
  workingHoursEnd,
  meetingHoursStart,
  meetingHoursEnd,
  includeWeekends,
  onWorkingHoursStartChange,
  onWorkingHoursEndChange,
  onMeetingHoursStartChange,
  onMeetingHoursEndChange,
  onIncludeWeekendsChange,
}: ConfigPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[14px] text-accent-indigo hover:underline transition-colors mx-auto"
      >
        <span>{open ? "Hide options" : "More options"}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="mt-5 space-y-5">
          <div className="space-y-2">
            <p className="text-[12px] font-medium text-apple-gray-light uppercase tracking-wider">
              My working hours
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label
                  htmlFor="working-start"
                  className="block text-[13px] text-apple-gray-mid mb-1"
                >
                  From
                </label>
                <input
                  id="working-start"
                  type="time"
                  value={workingHoursStart}
                  onChange={(e) => onWorkingHoursStartChange(e.target.value)}
                  className="w-full rounded-xl border border-apple-gray-border/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all duration-150"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="working-end"
                  className="block text-[13px] text-apple-gray-mid mb-1"
                >
                  To
                </label>
                <input
                  id="working-end"
                  type="time"
                  value={workingHoursEnd}
                  onChange={(e) => onWorkingHoursEndChange(e.target.value)}
                  className="w-full rounded-xl border border-apple-gray-border/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all duration-150"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[12px] font-medium text-apple-gray-light uppercase tracking-wider">
              Their meeting hours
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label
                  htmlFor="meeting-start"
                  className="block text-[13px] text-apple-gray-mid mb-1"
                >
                  From
                </label>
                <input
                  id="meeting-start"
                  type="time"
                  value={meetingHoursStart}
                  onChange={(e) => onMeetingHoursStartChange(e.target.value)}
                  className="w-full rounded-xl border border-apple-gray-border/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all duration-150"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="meeting-end"
                  className="block text-[13px] text-apple-gray-mid mb-1"
                >
                  To
                </label>
                <input
                  id="meeting-end"
                  type="time"
                  value={meetingHoursEnd}
                  onChange={(e) => onMeetingHoursEndChange(e.target.value)}
                  className="w-full rounded-xl border border-apple-gray-border/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all duration-150"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer justify-center">
            <input
              type="checkbox"
              checked={includeWeekends}
              onChange={(e) => onIncludeWeekendsChange(e.target.checked)}
              className="w-4 h-4 rounded text-apple-blue focus:ring-apple-blue/30 border-apple-gray-border"
            />
            <span className="text-[15px] text-apple-gray-mid">
              Include weekends
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
