export interface IndicatorConfig {
  id: string;
  name: string;
  fredSeriesId: string;
  description: string;
  unit: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  transform?: "chg" | "pch" | "pc1" | "lin";
  section: "liquidity" | "rates" | "economy" | "market";
  color: string;
  invert?: boolean;
  scale?: number;
}

export const INDICATORS: IndicatorConfig[] = [
  // === LIQUIDITY (Druckenmiller's #1 focus) ===
  {
    id: "fed-balance-sheet",
    name: "Fed Balance Sheet",
    fredSeriesId: "WALCL",
    description: "Federal Reserve Total Assets",
    unit: "$M",
    frequency: "weekly",
    section: "liquidity",
    color: "#3b82f6",
  },
  {
    id: "rrp",
    name: "Reverse Repo (RRP)",
    fredSeriesId: "RRPONTSYD",
    description: "Overnight Reverse Repurchase Agreements",
    unit: "$B",
    frequency: "daily",
    section: "liquidity",
    color: "#ef4444",
  },
  {
    id: "tga",
    name: "Treasury General Account",
    fredSeriesId: "WTREGEN",
    description: "US Treasury General Account Balance",
    unit: "$B",
    frequency: "weekly",
    section: "liquidity",
    color: "#f59e0b",
  },
  {
    id: "m2",
    name: "M2 Money Supply",
    fredSeriesId: "WM2NS",
    description: "M2 Money Stock (Not Seasonally Adjusted)",
    unit: "$B",
    frequency: "weekly",
    section: "liquidity",
    color: "#10b981",
  },

  // === MONETARY POLICY / RATES ===
  {
    id: "fed-funds-rate",
    name: "Fed Funds Rate",
    fredSeriesId: "DFF",
    description: "Effective Federal Funds Rate",
    unit: "%",
    frequency: "daily",
    section: "rates",
    color: "#8b5cf6",
  },
  {
    id: "yield-curve",
    name: "Yield Curve (10Y-2Y)",
    fredSeriesId: "T10Y2Y",
    description: "10-Year minus 2-Year Treasury Spread",
    unit: "%",
    frequency: "daily",
    section: "rates",
    color: "#ec4899",
  },
  {
    id: "10y-treasury",
    name: "10Y Treasury Yield",
    fredSeriesId: "DGS10",
    description: "10-Year Treasury Constant Maturity Rate",
    unit: "%",
    frequency: "daily",
    section: "rates",
    color: "#06b6d4",
  },
  {
    id: "2y-treasury",
    name: "2Y Treasury Yield",
    fredSeriesId: "DGS2",
    description: "2-Year Treasury Constant Maturity Rate",
    unit: "%",
    frequency: "daily",
    section: "rates",
    color: "#14b8a6",
  },

  // === ECONOMIC ACTIVITY ===
  {
    id: "ism-pmi",
    name: "ISM Manufacturing PMI",
    fredSeriesId: "MANEMP",
    description: "ISM Manufacturing: Employment Index",
    unit: "Index",
    frequency: "monthly",
    section: "economy",
    color: "#f97316",
  },
  {
    id: "unemployment",
    name: "Unemployment Rate",
    fredSeriesId: "UNRATE",
    description: "Civilian Unemployment Rate",
    unit: "%",
    frequency: "monthly",
    section: "economy",
    color: "#ef4444",
  },
  {
    id: "cpi",
    name: "CPI YoY",
    fredSeriesId: "CPIAUCSL",
    description: "Consumer Price Index (All Urban Consumers)",
    unit: "Index",
    frequency: "monthly",
    section: "economy",
    color: "#eab308",
    transform: "pc1",
  },
  {
    id: "initial-claims",
    name: "Initial Jobless Claims",
    fredSeriesId: "ICSA",
    description: "Initial Claims for Unemployment Insurance",
    unit: "K",
    frequency: "weekly",
    section: "economy",
    color: "#a855f7",
  },

  // === MARKET ===
  {
    id: "sp500",
    name: "S&P 500",
    fredSeriesId: "SP500",
    description: "S&P 500 Index",
    unit: "Index",
    frequency: "daily",
    section: "market",
    color: "#22c55e",
  },
  {
    id: "wilshire5000",
    name: "Wilshire 5000",
    fredSeriesId: "WILL5000IND",
    description: "Wilshire 5000 Total Market Index",
    unit: "Index",
    frequency: "daily",
    section: "market",
    color: "#0ea5e9",
  },
];

export const SECTIONS = [
  {
    id: "liquidity",
    title: "Liquidity",
    subtitle:
      '"Earnings don\'t move markets... it is liquidity that moves markets." — Stan Druckenmiller',
    description:
      "Druckenmiller's primary focus. Central bank balance sheets and money supply are the dominant forces driving asset prices.",
  },
  {
    id: "rates",
    title: "Monetary Policy & Rates",
    subtitle:
      '"Focus on Central Banks and what they\'re doing." — Stan Druckenmiller',
    description:
      "Fed policy direction, yield curve shape, and rate levels signal tightening vs. easing cycles.",
  },
  {
    id: "economy",
    title: "Economic Activity",
    subtitle:
      '"The best environment for stocks is a very dull, slow economy that the Federal Reserve is trying to get going." — Stan Druckenmiller',
    description:
      "Bottom-up macro signals that confirm or challenge the liquidity thesis.",
  },
  {
    id: "market",
    title: "Market",
    subtitle:
      '"The inside of the stock market... is the best economist I know." — Stan Druckenmiller',
    description:
      "Price action and market breadth as confirmation of macro conditions.",
  },
] as const;

export function getIndicatorsBySection(
  section: string
): IndicatorConfig[] {
  return INDICATORS.filter((i) => i.section === section);
}
