"use client";

export type TimePeriod = "1H" | "1D" | "1W" | "6M" | "1Y" | "5Y" | "10Y";

interface TimeHorizonSelectorProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "1H", label: "1H" },
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
  { value: "5Y", label: "5Y" },
  { value: "10Y", label: "10Y" },
];

export default function TimeHorizonSelector({
  selected,
  onChange,
}: TimeHorizonSelectorProps) {
  return (
    <div className="flex gap-1">
      {PERIODS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            selected === value
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
