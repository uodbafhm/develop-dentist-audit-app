import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cairo, IBM_Plex_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "600", "700", "800"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-plex-arabic",
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "MAPSO.RADAR — فحص الحضور الرقمي لعيادات الأسنان",
  description:
    "حلّل الحضور الرقمي لأي عيادة أسنان: إنستغرام، فيديو العيادة، خرائط جوجل، الموقع الإلكتروني، الحجز، والردّ على المرضى. نتيجة واضحة وخطة عمل مرتبة بالأولويات.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${plexArabic.variable} ${plexMono.variable} bg-paper font-sans text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
