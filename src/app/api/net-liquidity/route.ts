import { NextRequest, NextResponse } from "next/server";
import { fetchNetLiquidity, TimePeriod } from "@/lib/fred";

const VALID_PERIODS = new Set(["1H", "1D", "1W", "6M", "1Y", "5Y", "10Y"]);

export async function GET(request: NextRequest) {
  try {
    const periodParam = request.nextUrl.searchParams.get("period") || undefined;
    const period = periodParam && VALID_PERIODS.has(periodParam)
      ? (periodParam as TimePeriod)
      : undefined;

    const data = await fetchNetLiquidity(period);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    if (message.includes("FRED_API_KEY")) {
      return NextResponse.json(
        {
          error: "FRED API key not configured",
          message:
            "Set FRED_API_KEY in your .env.local file. Get a free key at https://fred.stlouisfed.org/docs/api/api_key.html",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch net liquidity", message },
      { status: 500 }
    );
  }
}
