"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download, Share2, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import {
  defaultInvoicePdfSettings,
  INVOICE_SETTINGS_PATH,
  mergeInvoiceSettings,
  type InvoicePdfSettings,
} from "@/lib/invoicePdfSettings";

interface Invoice {
  id: string;
  client_id: string | null;
  service: string | null;
  amount: number;
  status: "paid" | "unpaid";
  date: string | null;
  created_at: string | null;
  clients?: {
    name: string;
    email: string | null;
    company: string | null;
    phone: string | null;
  }[] | null;
}

interface ClientOption {
  id: string;
  name: string;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const details = error as { message?: string; details?: string; code?: string };
    return details.message || details.details || details.code || JSON.stringify(details);
  }

  return String(error);
}

function formatInvoiceDate(invoice: Invoice) {
  const rawDate = invoice.date || invoice.created_at;
  if (!rawDate) return "-";

  return new Date(rawDate).toLocaleDateString("sq-AL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInvoiceNumber(invoice: Invoice) {
  const year = new Date(invoice.date || invoice.created_at || Date.now()).getFullYear();
  const shortId = invoice.id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `INV-${year}-${shortId}`;
}

async function buildInvoicePdf(invoice: Invoice, settings: InvoicePdfSettings) {
  const clientName = invoice.clients?.[0]?.name || "Pa klient";
  const clientEmail = invoice.clients?.[0]?.email || "-";
  const clientCompany = invoice.clients?.[0]?.company || "-";
  const clientPhone = invoice.clients?.[0]?.phone || "-";
  const amountNumber = Number(invoice.amount || 0);
  const amount = `EUR ${amountNumber.toFixed(2)}`;
  const status = invoice.status === "paid" ? "E Paguar" : "Pa Paguar";
  const date = formatInvoiceDate(invoice);
  const service = invoice.service || "-";
  const invoiceNo = getInvoiceNumber(invoice);
  const qrValue = JSON.stringify({
    invoiceNo,
    id: invoice.id,
    amount,
    status,
    client: clientName,
    date,
    issuer: settings.companyName,
  });
  const qrDataUrl = await QRCode.toDataURL(qrValue, {
    margin: 0,
    width: 220,
    color: {
      dark: "#111111",
      light: "#ffffff",
    },
  });

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = 595;
  const pageHeight = 842;

  doc.setFillColor(15, 17, 21);
  doc.rect(0, 0, pageWidth, 128, "F");

  doc.setFillColor(197, 160, 89);
  doc.roundedRect(36, 30, 58, 58, 10, 10, "F");
  doc.setDrawColor(15, 17, 21);
  doc.setLineWidth(4);
  doc.line(50, 44, 65, 59);
  doc.line(50, 74, 65, 59);
  doc.line(80, 44, 65, 59);
  doc.line(80, 74, 65, 59);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("VIZUALX", 110, 55);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(214, 214, 214);
  doc.text(settings.companyTagline, 110, 74);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("INVOICE", 440, 48);
  doc.setTextColor(197, 160, 89);
  doc.setFontSize(11);
  doc.text(invoiceNo, 440, 68);
  doc.setTextColor(220, 220, 220);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${date}`, 440, 86);
  doc.text(`Status: ${status}`, 440, 102);

  doc.setFillColor(252, 249, 242);
  doc.roundedRect(36, 146, 252, 168, 10, 10, "F");
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(306, 146, 252, 168, 10, 10, "F");

  doc.setTextColor(145, 110, 48);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("From", 52, 170);
  doc.text("Bill To", 322, 170);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(13);
  doc.text(settings.companyName, 52, 192);
  doc.text(clientName, 322, 192);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text(settings.companyAddress, 52, 211);
  doc.text(`Phone: ${settings.companyPhone}`, 52, 228);
  doc.text(`Email: ${settings.companyEmail}`, 52, 245);
  doc.text(`NIPT: ${settings.companyNipt}`, 52, 262);

  doc.text(`Company: ${clientCompany}`, 322, 211);
  doc.text(`Phone: ${clientPhone}`, 322, 228);
  doc.text(`Email: ${clientEmail}`, 322, 245);
  doc.text(`Individ: ${settings.individualClientName}`, 322, 262);
  doc.text(`CIF: ${settings.clientCif}`, 322, 279);
  doc.text(`SSN: ${settings.personalSsn}`, 322, 296);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(36, 332, 522, 150, 10, 10, "F");
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(36, 332, 522, 150, 10, 10, "S");

  doc.setFillColor(247, 248, 250);
  doc.roundedRect(52, 350, 490, 34, 6, 6, "F");
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 62, 372);
  doc.text("Amount", 500, 372, { align: "right" });

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(service, 62, 410);
  doc.setFont("helvetica", "bold");
  doc.text(amount, 500, 410, { align: "right" });

  doc.setDrawColor(231, 231, 231);
  doc.line(52, 426, 542, 426);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text("Subtotal", 430, 446);
  doc.text(amount, 500, 446, { align: "right" });
  doc.text("TVSH", 430, 464);
  doc.text("EUR 0.00", 500, 464, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(145, 110, 48);
  doc.text("Total", 430, 480);
  doc.text(amount, 500, 480, { align: "right" });

  doc.addImage(qrDataUrl, "PNG", 52, 515, 88, 88);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Scan per verifikim fature", 52, 612);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(158, 515, 400, 124, 10, 10, "F");
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(158, 515, 400, 124, 10, 10, "S");
  doc.setTextColor(145, 110, 48);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("KONFIRMIM I LLOGARISE BANKARE", 170, 536);

  doc.setTextColor(70, 70, 70);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.4);
  doc.text(`Emri i Bankes: ${settings.bankName}`, 170, 554);
  doc.text(`Dega: ${settings.bankBranch}`, 170, 567);
  doc.text(`Emertimi i Llogarise: ${settings.bankAccountTitle}`, 170, 580);
  doc.text(`Numri i Llogarise: ${settings.bankAccountNumber}`, 170, 593);
  doc.text(`Monedha: ${settings.bankCurrency}`, 170, 606);
  doc.text(`IBAN: ${settings.bankIban}`, 170, 619);
  doc.text(`Swift Kodi: ${settings.bankSwift}`, 170, 632);

  doc.setTextColor(125, 125, 125);
  doc.text(
    `Kjo fature eshte gjeneruar nga ${settings.companyName} | ${settings.companyWebsite}`,
    36,
    pageHeight - 28
  );

  return doc;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [pdfSettings, setPdfSettings] = useState<InvoicePdfSettings>(defaultInvoicePdfSettings);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceEmailFeedback, setInvoiceEmailFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [emailSendingId, setEmailSendingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_id: "",
    service: "",
    amount: "",
    status: "unpaid" as "paid" | "unpaid",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    fetchClients();
    fetchInvoices();
    void loadInvoiceSettings();
  }, []);

  async function loadInvoiceSettings() {
    try {
      const { data } = supabase.storage
        .from("website-images")
        .getPublicUrl(INVOICE_SETTINGS_PATH);

      const response = await fetch(`${data.publicUrl}?t=${Date.now()}`);
      if (!response.ok) return;

      const json = (await response.json()) as unknown;
      setPdfSettings(mergeInvoiceSettings(json));
    } catch {
    }
  }

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch {
    }
  }

  async function fetchInvoices() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("invoices")
        .select("id, client_id, service, amount, status, date, created_at, clients(name, email, company, phone)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.client_id || !formData.service || !formData.amount || !formData.date) {
      alert("Plotësoni të gjitha fushat");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("invoices").insert([
        {
          client_id: formData.client_id,
          service: formData.service,
          amount: parseFloat(formData.amount),
          status: formData.status,
          date: formData.date,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setFormData({
        client_id: "",
        service: "",
        amount: "",
        status: "unpaid",
        date: new Date().toISOString().slice(0, 10),
      });
      setIsModalOpen(false);
      await fetchInvoices();
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || JSON.stringify(err);
      alert("Gabim gjatë ruajtjes: " + message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteInvoice(id: string) {
    if (!confirm("Jeni i sigurt që dëshironi të fshini këtë faturë?")) return;

    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
      await fetchInvoices();
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || JSON.stringify(err);
      alert("Gabim gjatë fshirjes: " + message);
    }
  }

  async function handleToggleStatus(invoice: Invoice) {
    try {
      const newStatus = invoice.status === "paid" ? "unpaid" : "paid";
      const { error } = await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", invoice.id);

      if (error) throw error;
      await fetchInvoices();
    } catch {
      alert("Gabim gjatë përditësimit. Provoni përnjëherë.");
    }
  }

  async function handleSendInvoiceEmail(invoice: Invoice) {
    const client = invoice.clients?.[0];

    if (!client?.email) {
      setInvoiceEmailFeedback({
        type: "error",
        message: "Ky klient nuk ka email të ruajtur për dërgimin e faturës.",
      });
      return;
    }

    try {
      setEmailSendingId(invoice.id);
      setInvoiceEmailFeedback(null);

      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: client.name || "Klient",
          email: client.email,
          recipientEmail: client.email,
          type: "Faturë e Re",
          message: `Fatura për ${invoice.service || "shërbimin tuaj"} me vlerë €${invoice.amount.toFixed(2)} është gati për ju.`,
          metadata: {
            invoiceId: invoice.id,
            service: invoice.service || "-",
            amount: `€${invoice.amount.toFixed(2)}`,
            status: invoice.status,
            date: invoice.date || invoice.created_at || "-",
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Dërgimi i email-it dështoi.");
      }

      setInvoiceEmailFeedback({
        type: "success",
        message: result.warning
          ? `Email-i u dërgua. Kujdes: ${result.warning}`
          : `Fatura iu dërgua me sukses klientit ${client.name}.`,
      });
    } catch (error) {
      setInvoiceEmailFeedback({
        type: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setEmailSendingId(null);
    }
  }

  async function handleDownloadPdf(invoice: Invoice) {
    const doc = await buildInvoicePdf(invoice, pdfSettings);
    doc.save(`fature-${invoice.id}.pdf`);
  }

  async function handleShareInvoice(invoice: Invoice) {
    const clientName = invoice.clients?.[0]?.name || "Klient";
    const title = `Fature VizualX - ${clientName}`;
    const text = `Fature per ${invoice.service || "sherbim"} me vlere EUR ${invoice.amount?.toFixed(2) || "0.00"}`;

    const doc = await buildInvoicePdf(invoice, pdfSettings);
    const pdfBlob = doc.output("blob");
    const pdfFile = new File([pdfBlob], `fature-${invoice.id}.pdf`, {
      type: "application/pdf",
    });

    if (
      navigator.share &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [pdfFile] })
    ) {
      try {
        await navigator.share({ title, text, files: [pdfFile] });
      } catch {
      }
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch {
      }
      return;
    }

    const shareText = `${title}\n${text}`;

    try {
      await navigator.clipboard.writeText(shareText);
      alert("Teksti i fatures u kopjua. Mund ta shperndash tani.");
    } catch {
      alert("Shperndarja nuk mbeshtetet ne kete pajisje.");
    }
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Faturat</h1>
          <p className="text-gray-400 text-sm mt-1">Menaxhoni dhe monitoroni faturat e klientëve.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-[#cfa861]/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
          </svg>
          Krijo Faturë
        </button>
      </div>

      {invoiceEmailFeedback ? (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            invoiceEmailFeedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {invoiceEmailFeedback.message}
        </div>
      ) : null}

      {/* Table */}
      <div className="mb-3 text-xs text-gray-500 md:hidden">Rrëshqit horizontalisht për të parë të gjitha kolonat dhe opsionet.</div>
      <div className="bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[1060px] text-left">
          <thead>
            <tr className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-5">Klienti</th>
              <th className="px-6 py-5">Përshkrimi i Shërbimit</th>
              <th className="px-6 py-5">Shuma</th>
              <th className="px-6 py-5">Statusi</th>
              <th className="px-6 py-5">Data</th>
              <th className="px-6 py-5 text-right">Opsione</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 animate-pulse">
                  Duke ngarkuar faturat...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                  Nuk u gjet asnjë faturë. Krijoni një faturë të re.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{invoice.clients?.[0]?.name || "Pa klient"}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm max-w-xs truncate">
                    {invoice.service || "-"}
                  </td>
                  <td className="px-6 py-4 text-white font-mono font-bold">
                    €{invoice.amount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer inline-block ${
                        invoice.status === "paid"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      }`}
                      onClick={() => handleToggleStatus(invoice)}
                      title="Kliko për të ndryshuar statusin"
                    >
                      {invoice.status === "paid" ? "✓ E Paguar" : "⏳ Pa Paguar"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{formatInvoiceDate(invoice)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDownloadPdf(invoice)}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                        title="Shkarko PDF"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleShareInvoice(invoice)}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                        title="Shperndaj"
                      >
                        <Share2 className="w-4 h-4" />
                        Shperndaj
                      </button>
                      <button
                        onClick={() => handleSendInvoiceEmail(invoice)}
                        disabled={emailSendingId === invoice.id || !invoice.clients?.[0]?.email}
                        className="inline-flex items-center rounded-lg border border-[#cfa861]/20 px-3 py-2 text-xs font-semibold text-[#cfa861] transition-colors hover:bg-[#cfa861]/10 disabled:cursor-not-allowed disabled:opacity-40"
                        title={invoice.clients?.[0]?.email ? "Dërgo me Email" : "Klienti nuk ka email"}
                      >
                        {emailSendingId === invoice.id ? "Duke dërguar..." : "Dërgo me Email"}
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="inline-flex items-center gap-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        title="Fshij faturën"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal - Create Invoice */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1c23] border border-[#cfa861]/30 rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Krijo Faturë të Re</h2>

            <form onSubmit={handleCreateInvoice} className="space-y-5">
              {/* Client */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Klienti
                </label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                >
                  <option value="">Zgjidh klientin</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {clients.length === 0 ? (
                  <p className="mt-2 text-xs text-orange-400">
                    Nuk ka klientë të regjistruar ende. Krijoni një klient para se të shtoni faturë.
                  </p>
                ) : null}
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Shërbimi
                </label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="p.sh. Dizajn Web, Konsultim, etj."
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Data e Faturës
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Shuma (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Statusi
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "paid" | "unpaid" })}
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#cfa861] transition-colors appearance-none cursor-pointer bg-no-repeat"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23cfa861'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="unpaid">Pa Paguar</option>
                  <option value="paid">E Paguar</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border-2 border-white/10 text-white font-semibold hover:border-white/20 transition-colors"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || clients.length === 0}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#cfa861] text-[#0f1115] font-bold hover:bg-[#e8c96f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Duke ruajtur..." : "Ruaj Faturë"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
