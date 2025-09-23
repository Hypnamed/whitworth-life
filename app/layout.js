import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import NavigationBar from "@/components/nav/NavigationBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Whitworth Life",
  description: "Social Media Platform for Whitworth Students and Faculty",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
          <NavigationBar />
          <main className="flex-1">
            {children}
            <Analytics />
          </main>
          <footer className="w-full h-24 flex items-center justify-center border-t mt-8">
            <p className="text-center">
              Made by{" "}
              <a className="underline" href="https://ilkeeren.dev">
                Eren
              </a>{" "}
              with ❤️
            </p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
