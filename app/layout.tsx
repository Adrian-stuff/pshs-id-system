"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NoSsrWrapper from "./no-ssr-wrapper";
export const dynamic = "force-dynamic";
const inter = Inter({ subsets: ["latin"] });
const isSSREnabled = () => typeof window === "undefined";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>PSHS Layouting System</title>
      <body className={inter.className}>
        <NoSsrWrapper>{!isSSREnabled() && children}</NoSsrWrapper>
      </body>
    </html>
  );
}
