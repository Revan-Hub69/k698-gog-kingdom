import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import CookieConsent from "@/components/Cookies";
import { GoogleAnalytics } from '@next/third-parties/google'
import { LanguageProvider } from "@/lib/LanguageProvider";


export const metadata: Metadata = {
  title: "k698 · Guns of Glory Kingdom Manager",
  description: "Master your kingdom's equipment strategy during events. Spiritual power management through Guard Weapons, Curiosities, and Coats of Arms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let theme = process.env.NEXT_PUBLIC_THEME
  if(!theme) {
    theme = "theme-sass3"
  }
  const gaID = process.env.NEXT_PUBLIC_GOOGLE_TAG;
  return (
    <html lang="en">
    <body className={theme}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
      <Analytics />
      <CookieConsent />
      { gaID && (
          <GoogleAnalytics gaId={gaID}/>
      )}

    </body>
    </html>
  );
}
