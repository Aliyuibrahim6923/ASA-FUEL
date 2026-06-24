import type { Metadata } from "next";
import "./globals.css";
import NavigationLayout from "../components/NavigationLayout";

export const metadata: Metadata = {
  title: "ASA-FUEL Logistics",
  description: "Comprehensive logistics, fleet, and financial management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavigationLayout>
          {children}
        </NavigationLayout>
      </body>
    </html>
  );
}
