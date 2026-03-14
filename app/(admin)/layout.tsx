import Sidebar from "@/components/Sidebar";
import AndroidInstallPrompt from "@/components/AndroidInstallPrompt";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0f1115]">
      <Sidebar />
      <main className="relative flex-1 min-h-screen overflow-y-auto pt-14 pb-[env(safe-area-inset-bottom)] md:pt-0">
        {children}
      </main>
      <AndroidInstallPrompt />
    </div>
  );
}
