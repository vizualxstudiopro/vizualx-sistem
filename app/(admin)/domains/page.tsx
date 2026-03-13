"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Globe, Calendar, DollarSign, Trash2, Plus, AlertCircle } from "lucide-react";

interface Domain {
  id: string;
  domain_name: string;
  client_name: string;
  provider: string;
  expiry_date: string;
  price: number;
  status: "active" | "inactive" | "expired";
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    domain_name: "",
    client_name: "",
    provider: "",
    expiry_date: "",
    price: "",
  });

  useEffect(() => {
    fetchDomains();
  }, []);

  async function fetchDomains() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .order("expiry_date", { ascending: true });

      if (error) throw error;
      setDomains(data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.domain_name || !formData.client_name || !formData.provider || !formData.expiry_date) {
      alert("Plotësoni të gjitha fushat e detyrueshme");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("domains").insert([
        {
          domain_name: formData.domain_name,
          client_name: formData.client_name,
          provider: formData.provider,
          expiry_date: formData.expiry_date,
          price: parseFloat(formData.price) || 0,
          status: "active",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        domain_name: "",
        client_name: "",
        provider: "",
        expiry_date: "",
        price: "",
      });
      await fetchDomains();
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || JSON.stringify(err);
      alert("Gabim gjatë ruajtjes: " + message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Jeni i sigurt që dëshironi të fshini këtë domain?")) return;

    try {
      const { error } = await supabase.from("domains").delete().eq("id", id);
      if (error) throw error;
      await fetchDomains();
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || JSON.stringify(err);
      alert("Gabim gjatë fshirjes: " + message);
    }
  }

  const calculateDaysUntilExpiry = (expiryDate: string): number => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate);

    if (daysUntilExpiry < 0) {
      return { status: "expired", label: "Skaduar", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    } else if (daysUntilExpiry <= 30) {
      return { status: "expiring", label: `${daysUntilExpiry} ditë`, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" };
    } else {
      return { status: "active", label: `${daysUntilExpiry} ditë`, color: "bg-green-500/20 text-green-400 border-green-500/30" };
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Domainet</h1>
          <p className="text-gray-400 text-sm mt-1">Menaxhoni dhe monitoroni të gjithë domenet tuaj.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-[#cfa861]/30"
        >
          <Plus className="w-5 h-5" />
          Shto Domain
        </button>
      </div>

      {/* Modal - Add Domain */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1c23] border border-[#cfa861]/30 rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Regjistro Domain të Ri</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Domain Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Emri i Domainit *
                </label>
                <input
                  type="text"
                  value={formData.domain_name}
                  onChange={(e) => setFormData({ ...formData, domain_name: e.target.value })}
                  placeholder="p.sh. example.com"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Emri i Klientit *
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="p.sh. ABC Kompania"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Kompania (Provider) *
                </label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="p.sh. Namecheap, GoDaddy, etc."
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Data e Skadencës *
                </label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Çmimi (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
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
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#cfa861] text-[#0f1115] font-bold hover:bg-[#e8c96f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Duke ruajtur..." : "Regjistro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Domains Table */}
      <div className="mb-3 text-xs text-gray-500 md:hidden">Rrëshqit horizontalisht për të parë të gjitha kolonat.</div>
      <div className="bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead>
            <tr className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Domeni
                </div>
              </th>
              <th className="px-6 py-5">Klienti</th>
              <th className="px-6 py-5">Provider</th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Skadenca
                </div>
              </th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Çmimi
                </div>
              </th>
              <th className="px-6 py-5">Statusi</th>
              <th className="px-6 py-5 text-right">Opsione</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 animate-pulse">
                  Duke ngarkuar domainet...
                </td>
              </tr>
            ) : domains.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-gray-500">
                  Nuk ka domena të regjistruara. Kliko butonin e mësipërm për të shtuar një.
                </td>
              </tr>
            ) : (
              domains.map((domain) => {
                const expiryStatus = getExpiryStatus(domain.expiry_date);

                return (
                  <tr key={domain.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-bold text-white">{domain.domain_name}</td>
                    <td className="px-6 py-4 text-gray-300">{domain.client_name}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{domain.provider}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${expiryStatus.status === "expired" || expiryStatus.status === "expiring" ? "text-orange-400" : "text-gray-300"}`}>
                        {expiryStatus.status === "expired" && <AlertCircle className="w-4 h-4 text-red-500" />}
                        <span className={expiryStatus.status === "expired" || expiryStatus.status === "expiring" ? "font-semibold" : ""}>
                          {new Date(domain.expiry_date).toLocaleDateString("sq-AL")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-mono">€{domain.price?.toFixed(2) || "0.00"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${expiryStatus.color}`}>
                        {expiryStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(domain.id)}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        title="Fshij domainin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
