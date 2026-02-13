import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macro Liquidity Dashboard — Druckenmiller Framework",
  description:
    "Track the macro liquidity indicators and economic data that Stan Druckenmiller monitors. Fed Balance Sheet, Net Liquidity, M2, Yield Curve, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black">{children}</body>
    </html>
  );
}
