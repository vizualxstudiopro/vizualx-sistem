"use client";

import { useEffect, useState } from "react";

const APK_URL = "/VizualX-Admin.apk";
const DISMISS_KEY = "vizualx-android-install-dismissed";

export default function AndroidInstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isAndroid = /android/i.test(navigator.userAgent);
    const isDismissed = localStorage.getItem(DISMISS_KEY);
    if (isAndroid && !isDismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function handleInstall() {
    window.location.href = APK_URL;
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1c23] p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#cfa861]/15">
            <svg className="h-6 w-6 text-[#cfa861]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Instalo Aplikacionin</h3>
            <p className="text-xs text-gray-400">VizualX Admin</p>
          </div>
        </div>

        <p className="mb-6 text-sm text-gray-300">
          Dëshironi të instaloni aplikacionin VizualX Admin për akses më të shpejtë nga pajisja juaj Android?
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-gray-400 transition-all hover:bg-white/10 hover:text-white"
          >
            Jo Tani
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 rounded-xl bg-[#cfa861] py-3 text-sm font-bold text-[#0f1115] transition-all hover:opacity-90"
          >
            Instalo
          </button>
        </div>
      </div>
    </div>
  );
}
