"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartDataPoint } from "@/types";
import { format, parseISO } from "date-fns";

interface NetLiquidityResponse {
  data: ChartDataPoint[];
  components: {
    fedBs: ChartDataPoint[];
    tga: ChartDataPoint[];
    rrp: ChartDataPoint[];
  };
}

export default function NetLiquidityChart() {
  const [data, setData] = useState<NetLiquidityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/net-liquidity");
        const json = await res.json();
        if (!res.ok) {
          setError(json.message || json.error || "Failed to fetch");
          return;
        }
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch net liquidity"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 animate-pulse col-span-full">
        <div className="h-5 bg-gray-800 rounded w-1/4 mb-2"></div>
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-800 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 col-span-full">
        <h3 className="text-lg font-semibold text-white">
          US Net Liquidity
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Fed Balance Sheet − TGA − RRP
        </p>
        <p className="text-red-400 text-sm text-center">{error}</p>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return null;
  }

  const latest = data.data[data.data.length - 1];
  const previous = data.data.length > 1 ? data.data[data.data.length - 2] : null;
  const change = previous ? latest.value - previous.value : null;
  const changePercent =
    change !== null && previous ? (change / Math.abs(previous.value)) * 100 : null;
  const isPositive = change !== null && change >= 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 col-span-full hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-lg font-semibold text-white">
            US Net Liquidity
          </h3>
          <p className="text-xs text-gray-500">
            Fed Balance Sheet − Treasury General Account − Reverse Repo
          </p>
        </div>
        <span className="text-xs text-gray-600">
          {format(parseISO(latest.date), "MMM d, yyyy")}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-white">
          ${latest.value.toFixed(2)}T
        </span>
        {changePercent !== null && (
          <span
            className={`text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}
          >
            {isPositive ? "+" : ""}
            {changePercent.toFixed(2)}%
          </span>
        )}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="gradient-net-liquidity"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickFormatter={(d: string) => format(parseISO(d), "MMM yy")}
              axisLine={false}
              tickLine={false}
              minTickGap={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickFormatter={(v: number) => `$${v.toFixed(1)}T`}
              axisLine={false}
              tickLine={false}
              width={60}
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
                value !== undefined ? `$${value.toFixed(2)}T` : "N/A",
                "Net Liquidity",
              ]}
              labelFormatter={(label) =>
                typeof label === "string"
                  ? format(parseISO(label), "MMM d, yyyy")
                  : String(label)
              }
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Net Liquidity"
              stroke="#8b5cf6"
              fill="url(#gradient-net-liquidity)"
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
