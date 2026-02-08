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
      <body className="text-apple-gray-dark antialiased">
        <nav className="bg-apple-nav/90 backdrop-blur-xl">
          <div className="max-w-[980px] mx-auto px-6 h-11 flex items-center justify-center">
            <span className="text-[14px] font-normal text-white/90 tracking-[-0.01em]">
              Availability
            </span>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
