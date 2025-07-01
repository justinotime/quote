import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from 'next/font/google';
import { AuthProvider } from './contexts/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://quote.com'),
  title: "Quote",
  description: "Write hard. Write true. Everything else is noise.",
  openGraph: {
    title: "Quote",
    description: "Write hard. Write true. Everything else is noise.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Quote Logo",
      },
    ],
    type: "website",
    siteName: "Quote",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quote",
    description: "Write hard. Write true. Everything else is noise.",
    images: ["/logo.png"],
  },
};

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat', 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <meta name="theme-color" content="#35b8be" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
