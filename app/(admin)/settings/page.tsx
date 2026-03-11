"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  clearOldAnalytics,
  getSystemSettings,
  logoutAllDevices,
  updateSystemSettings,
} from "@/lib/supabase";

type SystemSettings = {
  primary_color: string;
  maintenance_mode: boolean;
};

const defaultSettings: SystemSettings = {
  primary_color: "#FFD700",
  maintenance_mode: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const data = await getSystemSettings();
      setSettings(data);
      setLoading(false);
    }

    loadSettings();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", settings.primary_color);
  }, [settings.primary_color]);

  const handleColorChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const primaryColor = event.target.value;
    setSettings((current) => ({ ...current, primary_color: primaryColor }));
    await updateSystemSettings({ primary_color: primaryColor });
  };

  const handleMaintenanceChange = async () => {
    const maintenanceMode = !settings.maintenance_mode;
    setSettings((current) => ({ ...current, maintenance_mode: maintenanceMode }));
    await updateSystemSettings({ maintenance_mode: maintenanceMode });
  };

  const handleClearAnalytics = async () => {
    await clearOldAnalytics();
    alert("Analitikat e vjetra u fshine.");
  };

  const handleLogoutAll = async () => {
    await logoutAllDevices();
    alert("U loguat nga te gjitha pajisjet.");
  };

  if (loading) {
    return <div className="p-4 md:p-8 text-gray-400">Duke ngarkuar cilësimet...</div>;
  }

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Qendra e Kontrollit te Sistemit</h1>
        <p className="mt-2 text-sm text-gray-400">Menaxhoni pamjen, mirembajtjen dhe sigurine e sistemit.</p>
      </div>

      <section className="rounded-2xl border border-white/5 bg-[#1a1c23] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Personalizimi</h2>
        <label className="block text-sm text-gray-400">Ngjyra kryesore</label>
        <input type="color" value={settings.primary_color} onChange={handleColorChange} className="mt-3 h-12 w-24 rounded-lg bg-transparent" />
      </section>

      <section className="rounded-2xl border border-white/5 bg-[#1a1c23] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Mirembajtja</h2>
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <input type="checkbox" checked={settings.maintenance_mode} onChange={handleMaintenanceChange} />
          Aktivizo maintenance mode
        </label>
      </section>

      <section className="rounded-2xl border border-white/5 bg-[#1a1c23] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Pastrimi i te dhenave</h2>
        <button onClick={handleClearAnalytics} className="rounded-lg bg-[#cfa861] px-4 py-2 font-semibold text-[#0f1115] transition-all hover:opacity-90">
          Pastro analitikat e vjetra
        </button>
      </section>

      <section className="rounded-2xl border border-white/5 bg-[#1a1c23] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Siguria</h2>
        <button onClick={handleLogoutAll} className="rounded-lg bg-white/10 px-4 py-2 font-semibold text-white transition-all hover:bg-white/20">
          Dil nga te gjitha pajisjet
        </button>
      </section>
    </div>
  );
}