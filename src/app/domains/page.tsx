"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DomainsPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDomains();
  }, []);

  async function fetchDomains() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("domains")
        .select(`*, clients ( name )`)
        .order("expiry_date", { ascending: true });

      if (error) throw error;
      setDomains(data || []);
    } catch (error) {
      console.error("Gabim:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold">Domainet</h1>
          <p className="text-gray-400 text-sm mt-1">Menaxhoni pronësinë dhe skadencat e faqeve web.</p>
        </div>
        <button className="bg-[#cfa861] text-[#0f1115] px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-all">
          + Shto Domain
        </button>
      </div>

      <div className="bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-5">Domain</th>
              <th className="px-6 py-5">Klienti</th>
              <th className="px-6 py-5">Regjistruesi</th>
              <th className="px-6 py-5">Skadimi</th>
              <th className="px-6 py-5">Statusi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center animate-pulse text-gray-500">Duke kontrolluar serverat...</td></tr>
            ) : domains.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-500">Nuk keni asnjë domain të regjistruar.</td></tr>
            ) : (
              domains.map((domain) => {
                const isExpired = new Date(domain.expiry_date) < new Date();
                return (
                  <tr key={domain.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="px-6 py-4 font-bold text-[#cfa861]">{domain.domain_name}</td>
                    <td className="px-6 py-4 text-gray-300">{domain.clients?.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{domain.registrar}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(domain.expiry_date).toLocaleDateString('sq-AL')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        isExpired ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {isExpired ? 'I Skaduar' : 'Aktiv'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}