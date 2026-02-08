import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Availability — Calendar to Free Slots",
  description:
    "Upload calendar screenshots and get your available meeting times in any timezone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
