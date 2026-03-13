"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function AndroidQuickRefresh() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(/android/i.test(navigator.userAgent));
  }, []);

  if (!show) return null;

  function handleRefresh() {
    const url = new URL(window.location.href);
    url.searchParams.set("_r", Date.now().toString());
    window.location.replace(url.toString());
  }

  return (
    <button
      type="button"
      onClick={handleRefresh}
      className="fixed bottom-4 right-4 z-[90] inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#1a1c23]/95 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur hover:border-[#cfa861]/50"
      title="Rifresko aplikacionin"
    >
      <RefreshCw className="h-4 w-4 text-[#cfa861]" />
      Rifresko App
    </button>
  );
}
