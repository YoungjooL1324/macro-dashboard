import { FredSeriesResponse, ChartDataPoint, IndicatorData } from "@/types";
import { format, subYears } from "date-fns";

const FRED_BASE_URL = "https://api.stlouisfed.org/fred";

function getApiKey(): string {
  const key = process.env.FRED_API_KEY;
  if (!key) {
    throw new Error("FRED_API_KEY environment variable is not set");
  }
  return key;
}

export async function fetchFredSeries(
  seriesId: string,
  options: {
    observationStart?: string;
    observationEnd?: string;
    units?: string;
    frequency?: string;
  } = {}
): Promise<FredSeriesResponse> {
  const apiKey = getApiKey();
  const now = new Date();
  const twoYearsAgo = subYears(now, 2);

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: "json",
    observation_start:
      options.observationStart || format(twoYearsAgo, "yyyy-MM-dd"),
    observation_end: options.observationEnd || format(now, "yyyy-MM-dd"),
    sort_order: "asc",
  });

  if (options.units) {
    params.set("units", options.units);
  }
  if (options.frequency) {
    params.set("frequency", options.frequency);
  }

  const url = `${FRED_BASE_URL}/series/observations?${params.toString()}`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(
      `FRED API error for ${seriesId}: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export function parseObservations(
  response: FredSeriesResponse
): ChartDataPoint[] {
  return response.observations
    .filter((obs) => obs.value !== ".")
    .map((obs) => ({
      date: obs.date,
      value: parseFloat(obs.value),
    }));
}

export async function fetchIndicatorData(
  seriesId: string,
  transform?: string
): Promise<IndicatorData> {
  const response = await fetchFredSeries(seriesId, {
    units: transform,
  });

  const data = parseObservations(response);

  const latestValue = data.length > 0 ? data[data.length - 1].value : null;
  const previousValue = data.length > 1 ? data[data.length - 2].value : null;
  const change =
    latestValue !== null && previousValue !== null
      ? latestValue - previousValue
      : null;
  const changePercent =
    change !== null && previousValue !== null && previousValue !== 0
      ? (change / Math.abs(previousValue)) * 100
      : null;
  const lastUpdated = data.length > 0 ? data[data.length - 1].date : null;

  return {
    seriesId,
    data,
    latestValue,
    previousValue,
    change,
    changePercent,
    lastUpdated,
  };
}

export async function fetchNetLiquidity(): Promise<{
  data: ChartDataPoint[];
  components: {
    fedBs: ChartDataPoint[];
    tga: ChartDataPoint[];
    rrp: ChartDataPoint[];
  };
}> {
  // Fetch all three components in parallel
  const [fedBsResponse, tgaResponse, rrpResponse] = await Promise.all([
    fetchFredSeries("WALCL"),
    fetchFredSeries("WTREGEN"),
    fetchFredSeries("RRPONTSYD", { frequency: "w" }),
  ]);

  const fedBs = parseObservations(fedBsResponse);
  const tga = parseObservations(tgaResponse);
  const rrp = parseObservations(rrpResponse);

  // Create a map for TGA and RRP values by date for fast lookup
  const tgaMap = new Map(tga.map((d) => [d.date, d.value]));
  const rrpMap = new Map(rrp.map((d) => [d.date, d.value]));

  // Calculate Net Liquidity = Fed BS - TGA - RRP
  // Use Fed BS dates as the base, find nearest TGA/RRP values
  const netLiquidity: ChartDataPoint[] = [];
  let lastTga = 0;
  let lastRrp = 0;

  for (const point of fedBs) {
    const tgaVal = tgaMap.get(point.date);
    const rrpVal = rrpMap.get(point.date);

    if (tgaVal !== undefined) lastTga = tgaVal;
    if (rrpVal !== undefined) lastRrp = rrpVal;

    // WALCL is in millions, TGA is in billions, RRP is in billions
    // Normalize everything to billions
    const fedBsBillions = point.value / 1000;
    const netLiq = fedBsBillions - lastTga - lastRrp / 1000;

    netLiquidity.push({
      date: point.date,
      value: Math.round(netLiq * 100) / 100,
    });
  }

  return {
    data: netLiquidity,
    components: { fedBs, tga, rrp },
  };
}
