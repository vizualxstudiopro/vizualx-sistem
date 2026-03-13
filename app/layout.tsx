import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101010",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vizualx.online"),
  title: {
    default: "VizualX | Sisteme ERP, Web Development & Branding Premium",
    template: "%s | VizualX",
  },
  description: "Agjenci lider në Shqipëri për ndërtimin e sistemeve ERP, faqeve web profesionale, menaxhimin e rrjeteve sociale dhe identitet vizual.",
  keywords: ["ERP Shqiperi", "Web Development Albania", "Programim", "Branding", "VizualX", "agjenci digitale", "dizajn grafik", "social media management", "faqe web", "identitet vizual"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VizualX | Sisteme ERP, Web Development & Branding Premium",
    description: "Agjenci lider në Shqipëri për ndërtimin e sistemeve ERP, faqeve web profesionale, menaxhimin e rrjeteve sociale dhe identitet vizual.",
    url: "https://www.vizualx.online",
    siteName: "VizualX",
    locale: "sq_AL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VizualX | Sisteme ERP, Web Development & Branding Premium",
    description: "Agjenci lider në Shqipëri për ndërtimin e sistemeve ERP, faqeve web profesionale dhe identitet vizual.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google7fb95902fff77804",
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
