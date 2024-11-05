import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { PHProvider } from "./providers";
import dynamic from "next/dynamic";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

// Add type for layout props
interface RootLayoutProps {
  children: React.ReactNode;
}

// Use the interface
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        data-theme="light"
      >
        <PHProvider>
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            strategy="beforeInteractive"
          />
          <PostHogPageView />
          {children}
        </PHProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Kleinanzeigen Kurier",
  description: "Get your kleinanzeigen products delivered fast and cheap",
};
