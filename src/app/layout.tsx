import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { campaign } from "@/config/campaign";
import "./globals.css";

export const metadata: Metadata = {
  title: campaign.title,
  description: campaign.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: campaign.title,
    description: campaign.description,
    locale: "zh_TW",
    type: "website",
    siteName: campaign.brand.name,
  },
  // 展示版尚無核定公開網址，不設定 canonical 或冒用官網 URL。
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-Hant"
      style={
        Object.fromEntries([
          ...Object.entries(campaign.brand.colors).map(([key, value]) => [
            `--${key}`,
            value,
          ]),
          [
            "--font-sans",
            `"${campaign.brand.fonts.latin}", "${campaign.brand.fonts.traditionalChinese}", "Microsoft JhengHei", "PingFang TC", Arial, sans-serif`,
          ],
        ]) as CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
