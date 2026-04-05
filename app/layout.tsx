import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cleed Admin | Terminal",
  description: "Secure administrative management system for Cleed operations.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "https://ik.imagekit.io/dypkhqxip/White%20Modern%20Minimalist%20Signature%20Brand%20Logo%20(2).png", type: "image/png" }
    ],
    shortcut: "https://ik.imagekit.io/dypkhqxip/White%20Modern%20Minimalist%20Signature%20Brand%20Logo%20(2).png",
    apple: "https://ik.imagekit.io/dypkhqxip/White%20Modern%20Minimalist%20Signature%20Brand%20Logo%20(2).png",
  },
};

import SmoothScroll from "./components/home/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#F5332C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Cleed" />
        <link rel="apple-touch-icon" href="https://ik.imagekit.io/dypkhqxip/White%20Modern%20Minimalist%20Signature%20Brand%20Logo%20(2).png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-zinc-50 selection:text-black`}
      >
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.3/dist/dotlottie-wc.js" strategy="lazyOnload" type="module" />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
