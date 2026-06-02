import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { SWRegistration } from "@/components/SWRegistration";

export const metadata: Metadata = {
  title: "چقدر خوردم !",
  description: "مدیریت هوشمند تغذیه و کالری",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "چقدر خوردم !",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col pb-24">
        <SWRegistration />
        <main className="flex-1 w-full max-w-md mx-auto px-4 pt-6 overflow-x-hidden">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
