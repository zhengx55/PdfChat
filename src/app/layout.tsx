import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Provider from "@/components/Provider";
import "react-loading-skeleton/dist/skeleton.css";
const inter = Inter({ subsets: ["latin"] });
import "simplebar-react/dist/simplebar.min.css";
export const metadata: Metadata = {
  title: "Chat with ai and your pdf files",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <Provider>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy",
            inter.className
          )}
        >
          <Navbar />
          {children}
        </body>
      </Provider>
    </html>
  );
}
