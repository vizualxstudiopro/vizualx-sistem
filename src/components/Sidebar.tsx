"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    void fetchNotifications();

    const intervalId = window.setInterval(() => {
      void fetchNotifications();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  async function fetchNotifications() {
    try {
      const response = await fetch("/api/send-notification", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Njoftimet nuk u ngarkuan.");
      }

      const latestNotifications = (result.notifications || []) as NotificationItem[];
      setNotifications(latestNotifications);
      setHasUnreadNotifications(latestNotifications.some((item) => !item.is_read));
      setNotificationError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setNotifications([]);
      setHasUnreadNotifications(false);
      setNotificationError(
        message.includes("Could not find the table")
          ? "Tabela e njoftimeve nuk është konfiguruar ende."
          : "Njoftimet nuk u ngarkuan."
      );
    }
  }

  async function handleBellClick() {
    const nextOpenState = !isNotificationsOpen;
    setIsNotificationsOpen(nextOpenState);

    if (!nextOpenState) {
      return;
    }

    const unreadIds = notifications.filter((item) => !item.is_read).map((item) => item.id);

    if (unreadIds.length === 0) {
      return;
    }

    try {
      const response = await fetch("/api/send-notification", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: unreadIds }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Njoftimet nuk u përditësuan.");
      }

      setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
      setHasUnreadNotifications(false);
    } catch {
      setNotificationError("Njoftimet u hapën, por nuk u shënuan si të lexuara.");
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  // Lista e lidhjeve të menusë
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { name: "Klientët", path: "/clients", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
    { name: "Faturat", path: "/invoices", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    )},
    { name: "Domainet", path: "/domains", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
    )},
    { name: "Rrjetat Sociale", path: "/social", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.368 10.333 12.066 8 15.25 8c3.592 0 6.504 2.868 6.782 6.518M9 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { name: "Asetet", path: "/assets", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { name: "Portofoli CMS", path: "/portfolio-manager", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { name: "Projektet", path: "/projects", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    )},
    { name: "Konfigurimet e Web-it", path: "/web-settings", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { name: "Analitikat", path: "/analytics", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
    { name: "Të Dhënat", path: "/te-dhenat", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7a2 2 0 012-2h12a2 2 0 012 2M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7l8 5 8-5M8 15h8" /></svg>
    )},
    { name: "Cilësimet", path: "/settings", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];

  return (
    <aside className="hidden h-screen w-64 flex-col overflow-hidden bg-[#1a1c23] border-r border-white/5 md:flex">
      {/* Logo e Platformës */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 relative">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
          VIZUAL<span className="text-[#cfa861]">X</span>
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={handleBellClick}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-[#cfa861]/40 hover:text-white"
            aria-label="Hap njoftimet"
          >
            <Bell className="h-5 w-5" />
            {hasUnreadNotifications ? (
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500" />
            ) : null}
          </button>

          {isNotificationsOpen ? (
            <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-white/10 bg-[#111318] p-4 shadow-2xl shadow-black/40">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Njoftimet e Fundit</h3>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs text-gray-500 transition-colors hover:text-white"
                >
                  Mbyll
                </button>
              </div>

              {notificationError ? (
                <p className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs text-orange-300">
                  {notificationError}
                </p>
              ) : notifications.length === 0 ? (
                <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-sm text-gray-400">
                  Nuk ka njoftime për momentin.
                </p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                    >
                      <div className="mb-1 flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{notification.title}</p>
                        {!notification.is_read ? <span className="mt-1 h-2 w-2 rounded-full bg-red-500" /> : null}
                      </div>
                      <p className="line-clamp-2 text-xs text-gray-400">{notification.message}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-wide text-[#cfa861]">{notification.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Lidhjet e Menusë */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-[#cfa861]/10 text-[#cfa861]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Pjesa e poshtme (Navigim / Dalja) */}
      <div className="shrink-0 border-t border-white/5 bg-[#1a1c23] p-4 space-y-3">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6 6m0 0l-6 6m6-6H3" />
          </svg>
          Vizito Faqen Publike
        </Link>

        <a
          href="/VizualX-Admin.apk"
          download
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-[#cfa861] hover:bg-[#cfa861]/5 transition-all duration-200 text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Shkarko APK Android
        </a>

        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-[#cfa861] flex items-center justify-center text-[#0f1115] font-bold">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-gray-500">VizualX</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/15 hover:text-red-300 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
          </svg>
          {isLoggingOut ? "Duke dalë..." : "Dil"}
        </button>
      </div>
    </aside>
  );
}