"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { IndicatorConfig } from "@/lib/indicators";
import { IndicatorData, ChartDataPoint } from "@/types";
import { format, parseISO } from "date-fns";

interface IndicatorChartProps {
  indicator: IndicatorConfig;
  referenceLine?: number;
}

function formatValue(value: number, unit: string): string {
  if (unit === "$M") {
    return `$${(value / 1e6).toFixed(2)}T`;
  }
  if (unit === "$B") {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(2)}T`;
    }
    return `$${value.toFixed(0)}B`;
  }
  if (unit === "%") {
    return `${value.toFixed(2)}%`;
  }
  if (unit === "K") {
    return `${(value / 1000).toFixed(0)}K`;
  }
  if (unit === "Index") {
    return value.toFixed(1);
  }
  return value.toLocaleString();
}

function formatCompactValue(value: number, unit: string): string {
  if (unit === "$M") {
    return `$${(value / 1e6).toFixed(1)}T`;
  }
  if (unit === "$B") {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}T`;
    }
    return `$${value.toFixed(0)}B`;
  }
  return formatValue(value, unit);
}

export default function IndicatorChart({
  indicator,
  referenceLine,
}: IndicatorChartProps) {
  const [data, setData] = useState<IndicatorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (indicator.transform) {
        params.set("transform", indicator.transform);
      }
      const url = `/api/fred/${indicator.fredSeriesId}${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        setError(json.message || json.error || "Failed to fetch");
        return;
      }

      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [indicator.fredSeriesId, indicator.transform]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-800 rounded w-1/2 mb-4"></div>
        <div className="h-40 bg-gray-800 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400">{indicator.name}</h3>
        <div className="mt-4 text-center">
          <p className="text-red-400 text-sm">{error}</p>
          {error.includes("FRED_API_KEY") && (
            <p className="text-gray-500 text-xs mt-2">
              Get a free key at{" "}
              <a
                href="https://fred.stlouisfed.org/docs/api/api_key.html"
                className="text-blue-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                fred.stlouisfed.org
              </a>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400">{indicator.name}</h3>
        <p className="text-gray-600 text-sm mt-4 text-center">No data available</p>
      </div>
    );
  }

  const isPositive = data.change !== null && data.change >= 0;
  const changeColor = isPositive ? "text-green-400" : "text-red-400";

  // For yield curve, inversion (negative) is bearish
  const effectiveColor =
    indicator.id === "yield-curve" && data.latestValue !== null
      ? data.latestValue < 0
        ? "text-red-400"
        : "text-green-400"
      : undefined;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-medium text-gray-400">
            {indicator.name}
          </h3>
          <p className="text-xs text-gray-600">{indicator.description}</p>
        </div>
        {data.lastUpdated && (
          <span className="text-xs text-gray-600">
            {format(parseISO(data.lastUpdated), "MMM d")}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className={`text-2xl font-bold ${effectiveColor || "text-white"}`}>
          {data.latestValue !== null
            ? formatValue(data.latestValue, indicator.unit)
            : "N/A"}
        </span>
        {data.changePercent !== null && (
          <span className={`text-sm font-medium ${changeColor}`}>
            {isPositive ? "+" : ""}
            {data.changePercent.toFixed(2)}%
          </span>
        )}
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`gradient-${indicator.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={indicator.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={indicator.color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickFormatter={(d: string) => format(parseISO(d), "MMM yy")}
              axisLine={false}
              tickLine={false}
              minTickGap={50}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickFormatter={(v: number) =>
                formatCompactValue(v, indicator.unit)
              }
              axisLine={false}
              tickLine={false}
              width={55}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(value: number | undefined) => [
                value !== undefined
                  ? formatValue(value, indicator.unit)
                  : "N/A",
                indicator.name,
              ]}
              labelFormatter={(label) =>
                typeof label === "string"
                  ? format(parseISO(label), "MMM d, yyyy")
                  : String(label)
              }
            />
            {referenceLine !== undefined && (
              <ReferenceLine
                y={referenceLine}
                stroke="#6b7280"
                strokeDasharray="3 3"
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={indicator.color}
              fill={`url(#gradient-${indicator.id})`}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
