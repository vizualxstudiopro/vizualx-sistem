"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State për formën e re
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    website: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    setClients(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("clients").insert([formData]);
    
    if (!error) {
      setIsModalOpen(false);
      setFormData({ name: "", contact_person: "", email: "", phone: "", website: "" });
      fetchClients(); // Rifreskon listën automatikisht
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (!error) {
      fetchClients();
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-white">Klientët</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cfa861] text-[#0f1115] px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-all"
        >
          + Shto Klient
        </button>
      </div>

      {/* MODAL FORM (Shfaqet vetëm kur isModalOpen është true) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1c23] border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Regjistro Klient të Ri</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Emri i Biznesit" required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#cfa861] outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="text" placeholder="Personi Kontaktues"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#cfa861] outline-none"
                value={formData.contact_person}
                onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
              />
              <input 
                type="email" placeholder="Email"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#cfa861] outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="tel" placeholder="Telefon"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#cfa861] outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <input 
                type="url" placeholder="Website"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#cfa861] outline-none"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
              <div className="flex gap-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-lg hover:bg-white/10"
                >
                  Anulo
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#cfa861] text-[#0f1115] py-3 rounded-lg font-bold hover:opacity-90"
                >
                  Ruaj Klientin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABELA E KLIENTËVE */}
      <div className="bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Biznesi</th>
              <th className="px-6 py-4">Kontakt</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Telefon</th>
              <th className="px-6 py-4">Website</th>
              <th className="px-6 py-4 text-right">Veprime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="p-10 text-center animate-pulse">Duke u lidhur me databazën...</td></tr>
            ) : clients.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center">Asnjë klient. Shto të parin!</td></tr>
            ) : (
              clients.map(client => (
                <tr key={client.id} className="hover:bg-white/[0.01]">
                  <td className="px-6 py-4 font-bold text-white">{client.name}</td>
                  <td className="px-6 py-4">{client.contact_person}</td>
                  <td className="px-6 py-4">{client.email}</td>
                  <td className="px-6 py-4">{client.phone}</td>
                  <td className="px-6 py-4">{client.website}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(client.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Fshi
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}