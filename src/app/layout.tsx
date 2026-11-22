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
    images: [
      {
        url: new URL("brand/xk-logo-primary.png", campaign.pagesPreviewUrl),
        width: 1240,
        height: 820,
        type: "image/png",
        alt: "Xplore Kaleidoscope 正式標誌",
      },
    ],
  },
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
