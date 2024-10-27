import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";
import { SocketProvider } from "@/context/SocketProvider";
import { SessionProvider } from "next-auth/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Motion Otaku",
  description: "Developed by Aman Gupta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <SocketProvider>
            <main className="bg-gradient-to-r from-[#6D91EE] to-[#3B4CAB] min-h-screen">
              <Navbar />
              {children}
            </main>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
