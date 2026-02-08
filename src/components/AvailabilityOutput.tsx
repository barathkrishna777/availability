"use client";

import { useState } from "react";

interface AvailabilityOutputProps {
  formattedText: string;
  eventsFound: number;
  warnings: string[];
}

export default function AvailabilityOutput({
  formattedText,
  eventsFound,
  warnings,
}: AvailabilityOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {eventsFound} event{eventsFound !== 1 ? "s" : ""} found
        </p>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="bg-white border border-gray-200 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
        {formattedText}
      </pre>

      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-800 mb-1">Warnings</p>
          <ul className="text-sm text-yellow-700 space-y-0.5">
            {warnings.map((w, i) => (
              <li key={i}>- {w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
