import "./globals.css";
import { Inter, Open_Sans } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={openSans.className}>
        {children}
      </body>
    </html>
  );
}
