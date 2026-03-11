import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vizualx.online"),
  title: {
    default: "VizualX | Agjenci Digitale Premium",
    template: "%s | VizualX",
  },
  description: "Sisteme ERP, Web Development dhe Brand Identity — VizualX transformon idetë tuaja në zgjidhje dixhitale premium.",
  keywords: ["VizualX", "web development", "branding", "ERP systems", "social media management", "agjenci digitale", "dizajn"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VizualX | Agjenci Digitale Premium",
    description: "Sisteme ERP, Web Development dhe Brand Identity — zgjidhje dixhitale premium për biznese moderne.",
    url: "https://www.vizualx.online",
    siteName: "VizualX",
    locale: "sq_AL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VizualX | Agjenci Digitale Premium",
    description: "Sisteme ERP, Web Development dhe Brand Identity — zgjidhje dixhitale premium për biznese moderne.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body className="bg-[#0f1115] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
