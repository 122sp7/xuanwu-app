import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@shared-utils";
import { PlatformBootstrap } from "@/src/modules/platform/adapters/inbound/react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Xuanwu App",
  description: "Knowledge-management and AI-assisted workspace platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        <PlatformBootstrap>{children}</PlatformBootstrap>
      </body>
    </html>
  );
}
