"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  clearOldAnalytics,
  getSystemSettings,
  logoutAllDevices,
  updateSystemSettings,
} from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import {
  defaultInvoicePdfSettings,
  INVOICE_SETTINGS_PATH,
  mergeInvoiceSettings,
  type InvoicePdfSettings,
} from "@/lib/invoicePdfSettings";

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
  const [invoiceSettings, setInvoiceSettings] = useState<InvoicePdfSettings>(defaultInvoicePdfSettings);
  const [invoiceSaving, setInvoiceSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const data = await getSystemSettings();
      setSettings(data);
      await loadInvoiceSettings();
      setLoading(false);
    }

    loadSettings();
  }, []);

  async function loadInvoiceSettings() {
    try {
      const { data } = supabase.storage
        .from("website-images")
        .getPublicUrl(INVOICE_SETTINGS_PATH);

      const response = await fetch(`${data.publicUrl}?t=${Date.now()}`);
      if (!response.ok) return;

      const json = (await response.json()) as unknown;
      setInvoiceSettings(mergeInvoiceSettings(json));
    } catch {
    }
  }

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

  const handleInvoiceSettingsChange = <K extends keyof InvoicePdfSettings>(
    key: K,
    value: InvoicePdfSettings[K]
  ) => {
    setInvoiceSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSaveInvoiceSettings = async () => {
    try {
      setInvoiceSaving(true);
      const payload = JSON.stringify(invoiceSettings, null, 2);
      const blob = new Blob([payload], { type: "application/json;charset=utf-8" });

      const { error } = await supabase.storage
        .from("website-images")
        .upload(INVOICE_SETTINGS_PATH, blob, {
          upsert: true,
          contentType: "application/json",
          cacheControl: "60",
        });

      if (error) throw error;
      alert("Cilesimet e templates se fatures u ruajten.");
    } catch {
      alert("Ruajtja e cilesimeve deshtoi.");
    } finally {
      setInvoiceSaving(false);
    }
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

      <section className="rounded-2xl border border-white/5 bg-[#1a1c23] p-6">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Template e Fatures (PDF)</h2>
            <p className="text-xs text-gray-400">Ketu menaxhohen te dhenat e kompanise, klientit individ dhe bankes.</p>
          </div>
          <button
            onClick={handleSaveInvoiceSettings}
            disabled={invoiceSaving}
            className="rounded-lg bg-[#cfa861] px-4 py-2 font-semibold text-[#0f1115] transition-all hover:opacity-90 disabled:opacity-60"
          >
            {invoiceSaving ? "Duke ruajtur..." : "Ruaj Cilesimet"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={invoiceSettings.companyName} onChange={(e) => handleInvoiceSettingsChange("companyName", e.target.value)} placeholder="Emri i kompanise" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.companyTagline} onChange={(e) => handleInvoiceSettingsChange("companyTagline", e.target.value)} placeholder="Tagline" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.companyAddress} onChange={(e) => handleInvoiceSettingsChange("companyAddress", e.target.value)} placeholder="Adresa" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.companyPhone} onChange={(e) => handleInvoiceSettingsChange("companyPhone", e.target.value)} placeholder="Telefoni" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.companyEmail} onChange={(e) => handleInvoiceSettingsChange("companyEmail", e.target.value)} placeholder="Email" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.companyWebsite} onChange={(e) => handleInvoiceSettingsChange("companyWebsite", e.target.value)} placeholder="Website" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.companyNipt} onChange={(e) => handleInvoiceSettingsChange("companyNipt", e.target.value)} placeholder="NIPT" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.individualClientName} onChange={(e) => handleInvoiceSettingsChange("individualClientName", e.target.value)} placeholder="Emri i Klientit Individ" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.clientCif} onChange={(e) => handleInvoiceSettingsChange("clientCif", e.target.value)} placeholder="Numri i Klientit (CIF)" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.personalSsn} onChange={(e) => handleInvoiceSettingsChange("personalSsn", e.target.value)} placeholder="Numri Personal (SSN)" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.bankName} onChange={(e) => handleInvoiceSettingsChange("bankName", e.target.value)} placeholder="Emri i Bankes" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.bankBranch} onChange={(e) => handleInvoiceSettingsChange("bankBranch", e.target.value)} placeholder="Dega" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.bankAccountTitle} onChange={(e) => handleInvoiceSettingsChange("bankAccountTitle", e.target.value)} placeholder="Emertimi i Llogarise" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.bankAccountNumber} onChange={(e) => handleInvoiceSettingsChange("bankAccountNumber", e.target.value)} placeholder="Numri i Llogarise" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.bankCurrency} onChange={(e) => handleInvoiceSettingsChange("bankCurrency", e.target.value)} placeholder="Monedha" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.bankIban} onChange={(e) => handleInvoiceSettingsChange("bankIban", e.target.value)} placeholder="IBAN" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
          <input value={invoiceSettings.bankSwift} onChange={(e) => handleInvoiceSettingsChange("bankSwift", e.target.value)} placeholder="Swift Kodi" className="rounded-lg border border-white/10 bg-[#0f1115] px-3 py-2 text-sm text-white" />
        </div>
      </section>
    </div>
  );
}