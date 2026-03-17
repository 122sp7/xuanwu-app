import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xuanwu App",
  description: "Xuanwu App - Modular Domain-Driven Design template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
