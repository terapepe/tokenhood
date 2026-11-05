import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { CONFIG } from "@/config/site";

const title = "TokenHood ($HOOD) – The Meme of Robinhood Ecosystem";
const description =
  "Discover TokenHood ($HOOD), an independent community-driven meme token inspired by the growing Robinhood Chain ecosystem.";

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.website),
  title,
  description,
  applicationName: CONFIG.tokenName,
  keywords: ["TokenHood", "$HOOD", "Robinhood Chain", "meme token", "crypto", "onchain"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: CONFIG.website, siteName: CONFIG.tokenName, title, description },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#070B09", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-lg focus:bg-hood focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
