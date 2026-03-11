"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      setLoading(true);
      // Marrim faturat dhe emrin e klientit nga tabela 'clients'
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          clients (
            name
          )
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error("Gabim gjatë marrjes së faturave:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Faturat</h1>
          <p className="text-gray-400 text-sm mt-1">Monitoroni arkëtimet dhe statusin e pagesave.</p>
        </div>
        <button className="bg-[#cfa861] hover:bg-[#b59253] text-[#0f1115] px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>
          Krijo Faturë
        </button>
      </div>

      <div className="bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-5">Klienti</th>
              <th className="px-6 py-5">Shërbimi</th>
              <th className="px-6 py-5">Shuma</th>
              <th className="px-6 py-5">Statusi</th>
              <th className="px-6 py-5">Data</th>
              <th className="px-6 py-5 text-right">Opsione</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 animate-pulse">Duke ngarkuar faturat...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-500">Nuk u gjet asnjë faturë.</td></tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4 font-bold text-white">
                    {invoice.clients?.name || "Klient i panjohur"}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {invoice.service}
                  </td>
                  <td className="px-6 py-4 text-white font-mono">
                    €{invoice.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      invoice.status === 'paid' ? 'bg-green-500/10 text-green-500' : 
                      invoice.status === 'unpaid' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {invoice.status === 'paid' ? 'E Paguar' : 'Pa Paguar'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(invoice.date).toLocaleDateString('sq-AL')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2-8H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>
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