import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
//please contact adrian de vera for the id layouting system. email: twoadrian6@gmail.com
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>PSHS Layouting System</title>
      <body className={inter.className}> {children}</body>
    </html>
  );
}
