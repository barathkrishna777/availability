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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-apple-gray-light">
          {eventsFound} event{eventsFound !== 1 ? "s" : ""} detected
        </p>
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-5 py-2 text-[14px] rounded-full transition-all duration-200 active:scale-[0.97] ${
            copied
              ? "bg-apple-green text-white"
              : "bg-gradient-to-r from-accent-indigo to-apple-blue text-white hover:opacity-90"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <pre className="bg-white/70 backdrop-blur-sm rounded-2xl border border-apple-gray-border/60 p-8 text-[15px] whitespace-pre-wrap font-[inherit] leading-[1.8] text-apple-gray-dark">
        {formattedText}
      </pre>

      {warnings.length > 0 && (
        <div className="text-center">
          {warnings.map((w, i) => (
            <p key={i} className="text-[13px] text-apple-gray-light">
              {w}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
