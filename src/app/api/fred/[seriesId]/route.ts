import { NextRequest, NextResponse } from "next/server";
import { fetchIndicatorData } from "@/lib/fred";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ seriesId: string }> }
) {
  try {
    const { seriesId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const transform = searchParams.get("transform") || undefined;

    const data = await fetchIndicatorData(seriesId, transform);
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
      { error: "Failed to fetch data", message },
      { status: 500 }
    );
  }
}
