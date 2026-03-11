"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, Phone, Trash2, Plus } from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name || !formData.company || !formData.email) {
      alert("Plotësoni emrin, kompaninë dhe email-in");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("clients").insert([
        {
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          status: "active",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({ name: "", company: "", email: "", phone: "" });
      await fetchClients();
    } catch {
      alert("Gabim gjatë ruajtjes. Provoni përnjëherë.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Jeni i sigurt që dëshironi të fshini këtë klient?")) return;

    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
      await fetchClients();
    } catch {
      alert("Gabim gjatë fshirjes. Provoni përnjëherë.");
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Klientët</h1>
          <p className="text-gray-400 text-sm mt-1">Menaxhoni dhe monitoroni të gjithë klientët tuaj.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-[#cfa861]/30"
        >
          <Plus className="w-5 h-5" />
          Shto Klient
        </button>
      </div>

      {/* Modal - Add Client */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1c23] border border-[#cfa861]/30 rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Regjistro Klient të Ri</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Emri i Klientit *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="p.sh. Arben Rama"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Kompania *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="p.sh. ABC Kompania"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@example.com"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+355 69 123 4567"
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

      {/* Grid Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500">Duke ngarkuar klientët...</div>
        </div>
      ) : clients.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Nuk ka klientë të regjistuar. Kliko butonin e mësipërm për të shtuar një.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="group bg-[#1a1c23] border border-white/5 rounded-2xl p-6 hover:border-[#cfa861]/40 transition-all duration-300 hover:bg-white/[0.02] hover:shadow-lg hover:shadow-[#cfa861]/10"
            >
              {/* Header with Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#cfa861]/10">
                    <User className="w-5 h-5 text-[#cfa861]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-[#cfa861] transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-xs text-gray-500">{client.company}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    client.status === "active"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                  }`}
                >
                  {client.status === "active" ? "Aktiv" : "Pasiv"}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6 pb-6 border-b border-white/5">
                {/* Mail */}
                <a
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-[#cfa861] transition-colors group/link"
                >
                  <Mail className="w-4 h-4 text-gray-500 group-hover/link:text-[#cfa861] transition-colors" />
                  <span className="text-sm truncate">{client.email}</span>
                </a>

                {/* Phone */}
                {client.phone && (
                  <a
                    href={`tel:${client.phone}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-[#cfa861] transition-colors group/link"
                  >
                    <Phone className="w-4 h-4 text-gray-500 group-hover/link:text-[#cfa861] transition-colors" />
                    <span className="text-sm">{client.phone}</span>
                  </a>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(client.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all font-semibold text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Fshij Klientin
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
