"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { Sliders, Wrench } from "lucide-react";
import { getSystemSettings, updateSystemSettings, clearOldAnalytics, logoutAllDevices } from "../../../lib/supabase";

export default function SettingsPage() {
  const [settings, setSettings] = useState({ primary_color: "#FFD700", maintenance_mode: false });
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState(settings.primary_color);
  const [maintenance, setMaintenance] = useState(settings.maintenance_mode);

  useEffect(() => {
    getSystemSettings().then((data) => {
      setSettings(data);
      setColor(data.primary_color);
      setMaintenance(data.maintenance_mode);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", color);
  }, [color]);

  const handleColorChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    await updateSystemSettings({ primary_color: e.target.value });
  };

  const handleMaintenanceChange = async () => {
    setMaintenance(!maintenance);
    await updateSystemSettings({ maintenance_mode: !maintenance });
  };

  const handleClearAnalytics = async () => {
    await clearOldAnalytics();
    alert("Analitikat e vjetra u fshinë.");
  };

  const handleRefreshCache = () => {
    window.location.reload();
  };

  const handleLogoutAll = async () => {
    await logoutAllDevices();
    alert("U loguat nga të gjitha pajisjet.");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ color: "var(--primary-color)" }}>Qendra e Kontrollit të Sistemit</h1>
      <section>
        <h2>Customization</h2>
        <label>Ngjyra kryesore: </label>
        <input type="color" value={color} onChange={handleColorChange} />
      </section>
      <section>
        <h2>Mirëmbajtja</h2>
        <label>
          Maintenance Mode:
          <input type="checkbox" checked={maintenance} onChange={handleMaintenanceChange} />
        </label>
      </section>
      <section>
        <h2>Pastrimi i Memories</h2>
        <button onClick={handleClearAnalytics}>Pastro Analitikat e vjetra</button>
        <button onClick={handleRefreshCache}>Rifresko Cache</button>
      </section>
      <section>
        <h2>Siguria</h2>
        <button onClick={handleLogoutAll}>Log Out nga të gjitha pajisjet</button>
      </section>
    </div>
  );
}
