"use client";

import Link from "next/link";
import { Users, TrendingUp, AlertTriangle, Rocket } from 'lucide-react';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 12,
    unpaidInvoices: 0,
    totalRevenue: 0
  });

  // Të dhëna fiktive për grafikun (më vonë do t'i marrim nga DB)
  const chartData = [
    { name: 'Jan', fitimi: 400 },
    { name: 'Feb', fitimi: 800 },
    { name: 'Mar', fitimi: 600 },
    { name: 'Apr', fitimi: 1200 },
    { name: 'Maj', fitimi: 1900 },
    { name: 'Qer', fitimi: 2400 },
  ];

  useEffect(() => {
    async function getDashboardStats() {
      const { count: clientCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
      const { data: invoiceData } = await supabase.from('invoices').select('amount, status');

      const unpaid = invoiceData?.filter(i => i.status === 'unpaid').length || 0;
      const total = invoiceData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      setStats(prev => ({
        ...prev,
        totalClients: clientCount || 0,
        unpaidInvoices: unpaid,
        totalRevenue: total
      }));
    }
    getDashboardStats();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Paneli i Kontrollit</h1>
        <p className="text-gray-400">Mirëseveke në VizualX. Ja performanca e agjencisë suaj.</p>
      </div>

      {/* Kartat e Statistikave */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Klientë" value={stats.totalClients} icon={Users} color="text-blue-500" href="/clients" />
        <StatCard title="Të ardhura Totale" value={`€${stats.totalRevenue}`} icon={TrendingUp} color="text-green-500" href="/invoices" />
        <StatCard title="Fatura Pa Paguar" value={stats.unpaidInvoices} icon={AlertTriangle} color="text-red-500" href="/invoices" />
        <StatCard title="Projekte Aktivë" value={stats.activeProjects} icon={Rocket} color="text-[#cfa861]" href="/projects" />
      </div>

      {/* Grafikët */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1a1c23] p-6 rounded-2xl border border-white/5 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Trendi i të Ardhurave (€)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorFitimi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cfa861" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#cfa861" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1c23', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#cfa861' }}
                />
                <Area type="monotone" dataKey="fitimi" stroke="#cfa861" strokeWidth={3} fillOpacity={1} fill="url(#colorFitimi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1a1c23] p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-2">Përmbledhje</h3>
            <p className="text-gray-500 text-sm mb-6">Analiza mujore e rritjes.</p>
            <div className="space-y-4">
                <ProgressItem label="Social Media Management" percent={75} />
                <ProgressItem label="Web Development" percent={45} />
                <ProgressItem label="Graphic Design" percent={90} />
                <ProgressItem label="SEO Optimization" percent={30} />
            </div>
        </div>
      </div>
    </div>
  );
}

// Komponentë ndihmës brenda skedarit
function StatCard({ title, value, icon: IconComponent, color, href }: any) {
  const content = (
    <div className="bg-[#1a1c23] border border-white/5 p-6 rounded-2xl hover:border-[#cfa861]/20 transition-all cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        {IconComponent && <IconComponent className="w-8 h-8 text-blue-500" />}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function ProgressItem({ label, percent }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-gray-300">{label}</span>
        <span className="text-[#cfa861]">{percent}%</span>
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div className="bg-[#cfa861] h-full rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
