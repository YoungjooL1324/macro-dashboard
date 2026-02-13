import { NextResponse } from "next/server";
import { fetchNetLiquidity } from "@/lib/fred";

export async function GET() {
  try {
    const data = await fetchNetLiquidity();
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
