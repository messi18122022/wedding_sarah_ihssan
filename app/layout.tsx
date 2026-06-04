import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Ihssan & Sarah — 6 September 2026",
  description: "We're getting married! Join us in Küsnacht, Zürich.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500&family=Scheherazade+New:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
