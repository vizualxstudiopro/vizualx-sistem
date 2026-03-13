import Sidebar from "@/components/Sidebar";
import AndroidInstallPrompt from "@/components/AndroidInstallPrompt";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1115]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative pt-14 md:pt-0 pb-[env(safe-area-inset-bottom)]">
        {children}
      </main>
      <AndroidInstallPrompt />
    </div>
  );
}
