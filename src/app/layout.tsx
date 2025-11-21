import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyInterview | Pilot Interview Studio",
  description: "The all-in-one platform for Ethiopian Airlines trainee pilot selection. Practice speech-based interviews, group discussions, and master aviation knowledge.",
  keywords: ["Ethiopian Airlines", "Pilot Interview", "Group Discussion", "Aviation Knowledge", "Cadet Pilot Program"],
  verification: {
      google: "87-GTp5D1qpm20UkYjRLECs0iK7ibjOoy7kZyZ_FiRA",
    },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
