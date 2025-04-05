import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "../components/ui/theme-provider";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FundChain - Decentralized Fundraising",
  description: "A platform for blockchain-based fundraising campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Providers>
              <Navbar />
              {children}
              <Footer />
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
