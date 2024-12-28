import type { Metadata } from "next";
import { cn } from "@/utils/tw-merge";
import { Toaster } from "sonner";
import "./globals.css";

import { Jost } from "next/font/google";
const jost = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Server",
  description: "A file server built with MERN stack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="root" className={cn(["text-body", jost.className])}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
