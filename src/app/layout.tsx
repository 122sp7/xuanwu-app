import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xuanwu App",
  description: "Xuanwu App",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
