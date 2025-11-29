import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from '@/app/ConvexClientProvider'
import { ClerkProvider } from '@clerk/nextjs'
import Link from "next/link";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import { FaCalendarDay, FaUser } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Track",
  description: "Track your time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
        <div className="dock dock-xl">
          <button>
            <Link href="/" className="flex flex-col items-center gap-2">
              <HiHome className="size-[1.2em]" />
              <span className="dock-label">Home</span>
            </Link>
          </button>
          
          <button>
            <Link href="/daily-report" className="flex flex-col items-center gap-2 relative">
            
            <FaCalendarDay className="size-[1.2em]" />
              <span className="dock-label">Daily Report</span>
            </Link>
          </button>
          
          <button>
            <Link href="/monthly-report" className="flex flex-col items-center gap-2 relative">
            {/* <div className="badge badge-success badge-xs absolute -top-2 right-0 p-[2px]">New</div> */}
              <MdOutlineCalendarMonth className="size-[1.2em]" />
              <span className="dock-label">Monthly Report</span>
            </Link>
          </button>
          <button>
            <Link href="/profile" className="flex flex-col items-center gap-2 relative">
            {/* <div className="badge badge-success badge-xs absolute -top-2 right-0 p-[2px]">New</div> */}
              <FaUser className="size-[1.2em]" />
              <span className="dock-label">Profile</span>
            </Link>
          </button>
        </div>
      </body>
    </html>
  );
}