"use client";

import { useState } from "react";

interface ConfigPanelProps {
  meetingHoursStart: string;
  meetingHoursEnd: string;
  includeWeekends: boolean;
  onMeetingHoursStartChange: (value: string) => void;
  onMeetingHoursEndChange: (value: string) => void;
  onIncludeWeekendsChange: (value: boolean) => void;
}

export default function ConfigPanel({
  meetingHoursStart,
  meetingHoursEnd,
  includeWeekends,
  onMeetingHoursStartChange,
  onMeetingHoursEndChange,
  onIncludeWeekendsChange,
}: ConfigPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>Options</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="meeting-start"
                className="block text-sm text-gray-600 mb-1"
              >
                Meeting hours start
              </label>
              <input
                id="meeting-start"
                type="time"
                value={meetingHoursStart}
                onChange={(e) => onMeetingHoursStartChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="meeting-end"
                className="block text-sm text-gray-600 mb-1"
              >
                Meeting hours end
              </label>
              <input
                id="meeting-end"
                type="time"
                value={meetingHoursEnd}
                onChange={(e) => onMeetingHoursEndChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeWeekends}
              onChange={(e) => onIncludeWeekendsChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Include weekends</span>
          </label>
        </div>
      )}
    </div>
  );
}
