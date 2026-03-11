'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import PublicNavbar from './website/Navbar';
import Footer from './website/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the route is an admin route
  const isAdminRoute = ['/dashboard', '/clients', '/invoices', '/board', '/projects', '/domains'].some((route) =>
    pathname.startsWith(route)
  );

  return isAdminRoute ? (
    // Admin Layout
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  ) : (
    // Public Layout
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
