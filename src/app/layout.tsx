import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/packages/ui-shadcn";
import { ThemeProvider } from "@ui-shadcn/provider/theme-provider";
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
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PlatformBootstrap>{children}</PlatformBootstrap>
        </ThemeProvider>
      </body>
    </html>
  );
}
