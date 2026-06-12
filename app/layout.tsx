import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HM 私人 AI 穿搭",
  description: "A personal AI outfit recommendation assistant."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
