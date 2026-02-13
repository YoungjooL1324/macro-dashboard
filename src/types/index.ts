export interface FredObservation {
  date: string;
  value: string;
}

export interface FredSeriesResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FredObservation[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface IndicatorData {
  seriesId: string;
  data: ChartDataPoint[];
  latestValue: number | null;
  previousValue: number | null;
  change: number | null;
  changePercent: number | null;
  lastUpdated: string | null;
}

export interface NetLiquidityData {
  data: ChartDataPoint[];
  latestValue: number | null;
  change: number | null;
  changePercent: number | null;
}
