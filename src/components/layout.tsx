import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "VizualX CRM | Paneli i Menaxhimit",
  description: "Platforma SaaS për menaxhimin e agjencisë VizualX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq">
      {/* Ky "flex h-screen" siguron që menuja merr lartësinë e plotë dhe përmbajtja rri në të djathtë */}
      <body className="flex h-screen overflow-hidden bg-[#0f1115] text-white antialiased">
        
        {/* Menuja Anësore */}
        <Sidebar />

        {/* Zona e Përmbajtjes kryesore ku do të hapen faqet (Klientët, Faturat etj) */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
        
      </body>
    </html>
  );
}