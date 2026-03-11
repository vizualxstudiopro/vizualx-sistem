import Sidebar from "@/components/Sidebar";
import AndroidInstallPrompt from "@/components/AndroidInstallPrompt";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
      <AndroidInstallPrompt />
    </div>
  );
}
