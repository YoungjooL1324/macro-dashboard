"use client";

import SectionHeader from "./SectionHeader";
import IndicatorChart from "./IndicatorChart";
import NetLiquidityChart from "./NetLiquidityChart";
import { SECTIONS, getIndicatorsBySection } from "@/lib/indicators";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Macro Liquidity Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Tracking the indicators that move markets — inspired by Stan
                Druckenmiller&apos;s framework
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-600">Data from FRED API</p>
              <p className="text-xs text-gray-600">
                Federal Reserve Economic Data
              </p>
            </div>
          </div>

          {/* Framework summary */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
              <p className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                Lens 1: Liquidity
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Central bank policy &amp; money flows — the primary driver
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
              <p className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                Lens 2: Valuation
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Risk gauge for magnitude, not timing
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
              <p className="text-xs font-medium text-pink-400 uppercase tracking-wider">
                Lens 3: Technicals
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Breadth &amp; price action for timing confirmation
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {SECTIONS.map((section) => {
          const indicators = getIndicatorsBySection(section.id);
          return (
            <section key={section.id}>
              <SectionHeader
                title={section.title}
                subtitle={section.subtitle}
                description={section.description}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Net Liquidity chart spans full width in the liquidity section */}
                {section.id === "liquidity" && <NetLiquidityChart />}

                {indicators.map((indicator) => (
                  <IndicatorChart
                    key={indicator.id}
                    indicator={indicator}
                    referenceLine={
                      indicator.id === "yield-curve"
                        ? 0
                        : indicator.id === "ism-pmi"
                          ? 50
                          : undefined
                    }
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Footer with Druckenmiller quotes and methodology */}
        <footer className="border-t border-gray-800 pt-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Key Formula
              </h3>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-300 font-mono">
                  Net Liquidity = Fed Balance Sheet − TGA − RRP
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  When net liquidity rises, more money is available for financial
                  assets. When it falls, conditions tighten.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Framework
              </h3>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  &ldquo;I never use valuation to time the market. I use
                  liquidity considerations and technical analysis for timing.
                  Valuation only tells me how far the market can go once a
                  catalyst enters the picture to change the market direction.
                  The catalyst is liquidity.&rdquo;
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  — Stanley Druckenmiller
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-700 mt-8 text-center">
            Data sourced from the Federal Reserve Economic Data (FRED) API.
            This dashboard is for informational purposes only and does not
            constitute investment advice.
          </p>
        </footer>
      </main>
    </div>
  );
}
