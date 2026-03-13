"use client";

import Link from "next/link";
import { Users, TrendingUp, AlertTriangle, Rocket, FileText, Globe, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

interface ClientSummary {
  id: string | number;
  name: string;
  email: string;
}

interface InvoiceSummary {
  id: string | number;
  service: string;
  amount: number | string;
  status: 'paid' | 'unpaid' | string;
  date: string;
  clients?: {
    name: string;
  } | null;
}

type ActivityIconName = 'FileText' | 'User' | 'CheckCircle2' | 'Globe';

interface ActivityLogItem {
  id: number;
  action: string;
  time: string;
  icon: ActivityIconName;
}

interface UpcomingTask {
  id: number;
  task: string;
  deadline: string;
  priority: 'Lartë' | 'Mesatar' | 'Ulët';
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  color?: string;
  href?: string;
}

interface ProgressItemProps {
  label: string;
  percent: number;
}

interface QuickActionBtnProps {
  href: string;
  icon?: LucideIcon;
  label: string;
}

const activityIcons: Record<ActivityIconName, LucideIcon> = {
  FileText,
  User: Users,
  CheckCircle2: Globe,
  Globe,
};

export default function Dashboard() {
  const [chartsReady, setChartsReady] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    unpaidInvoices: 0,
    totalRevenue: 0
  });
  const [recentClients, setRecentClients] = useState<ClientSummary[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Jan', fitimi: 0 },
    { name: 'Feb', fitimi: 0 },
    { name: 'Mar', fitimi: 0 },
    { name: 'Apr', fitimi: 0 },
    { name: 'Maj', fitimi: 0 },
    { name: 'Qer', fitimi: 0 },
  ];

  const activityLog: ActivityLogItem[] = [];
  const upcomingTasks: UpcomingTask[] = [];

  useEffect(() => {
    setChartsReady(true);

    async function getDashboardData() {
      setLoading(true);
      try {
        // Statistika
        const { count: clientCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
        const { data: invoiceData } = await supabase.from('invoices').select('amount, status');
        const { count: activeProjectCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'done');
        const unpaid = invoiceData?.filter(i => i.status === 'unpaid').length || 0;
        const total = invoiceData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        setStats(prev => ({
          ...prev,
          totalClients: clientCount || 0,
          activeProjects: activeProjectCount || 0,
          unpaidInvoices: unpaid,
          totalRevenue: total
        }));

        // Klientë të fundit
        const { data: clients } = await supabase.from('clients').select('*').order('created_at', { ascending: false }).limit(5);
        setRecentClients(clients || []);

        // Faturat e fundit
        const { data: invoices } = await supabase.from('invoices').select('*, clients(name)').order('date', { ascending: false }).limit(5);
        setRecentInvoices(invoices || []);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    getDashboardData();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Paneli i Kontrollit</h1>
        <p className="text-gray-400">Mirëseveke në VizualX. Ja performanca e agjencisë suaj.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Klientë" value={stats.totalClients} icon={Users} color="text-blue-500" href="/clients" />
        <StatCard title="Të ardhura Totale" value={`€${stats.totalRevenue}`} icon={TrendingUp} color="text-green-500" href="/invoices" />
        <StatCard title="Fatura Pa Paguar" value={stats.unpaidInvoices} icon={AlertTriangle} color="text-red-500" href="/invoices" />
        <StatCard title="Projekte Aktivë" value={stats.activeProjects} icon={Rocket} color="text-[#cfa861]" href="/projects" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#1a1c23] p-6 rounded-2xl border border-white/5 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Trendi i të Ardhurave (€)</h3>
          <div className="h-[300px] w-full">
            {chartsReady ? (
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
            ) : (
              <div className="h-full animate-pulse rounded-xl bg-white/5" />
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-[#1a1c23] p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Përmbledhje Performancës</h3>
          <div className="space-y-4">
            <ProgressItem label="Web Development" percent={0} />
            <ProgressItem label="Branding" percent={0} />
            <ProgressItem label="Social Media" percent={0} />
            <ProgressItem label="ERP/Sistemet" percent={0} />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Clients */}
        <div className="lg:col-span-1 bg-[#1a1c23] p-6 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Klientë të Fundit</h3>
            <Link href="/clients" className="text-[#cfa861] text-sm hover:underline">Shiko të Gjithë →</Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-400 text-sm">Duke ngarkuar...</p>
            ) : recentClients.length === 0 ? (
              <p className="text-gray-400 text-sm">Nuk ka klientë akoma</p>
            ) : (
              recentClients.map((client) => (
                <div key={client.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <p className="font-semibold text-white text-sm">{client.name}</p>
                  <p className="text-gray-400 text-xs">{client.email}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-1 bg-[#1a1c23] p-6 rounded-2xl border border-white/5 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Aktiviteti i Fundit</h3>
          <div className="space-y-3">
            {activityLog.length === 0 ? (
              <p className="text-gray-400 text-sm">Nuk ka aktivitet akoma</p>
            ) : activityLog.map((log) => {
              const ActivityIcon = activityIcons[log.icon];
              return (
                <div key={log.id} className="flex gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <ActivityIcon className="w-5 h-5 text-[#cfa861]" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{log.action}</p>
                    <p className="text-gray-400 text-xs">{log.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="lg:col-span-1 bg-[#1a1c23] p-6 rounded-2xl border border-white/5 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Detyra të Ardhshme</h3>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-400 text-sm">Nuk ka detyra akoma</p>
            ) : upcomingTasks.map((task) => (
              <div key={task.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-white text-sm font-medium">{task.task}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'Lartë' ? 'bg-red-500/20 text-red-500' :
                    task.priority === 'Mesatar' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-green-500/20 text-green-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">{task.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-[#1a1c23] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Faturat e Fundit</h3>
          <Link href="/invoices" className="text-[#cfa861] text-sm hover:underline">Shiko të Gjithë →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-white/10">
              <tr>
                <th className="pb-3 text-gray-400 font-medium">Klienti</th>
                <th className="pb-3 text-gray-400 font-medium">Shërbimi</th>
                <th className="pb-3 text-gray-400 font-medium">Shuma</th>
                <th className="pb-3 text-gray-400 font-medium">Statusi</th>
                <th className="pb-3 text-gray-400 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-4 text-center text-gray-400">Duke ngarkuar...</td></tr>
              ) : recentInvoices.length === 0 ? (
                <tr><td colSpan={5} className="py-4 text-center text-gray-400">Nuk ka fatura akoma</td></tr>
              ) : (
                recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 text-white font-medium">{invoice.clients?.name || 'Anonima'}</td>
                    <td className="py-3 text-gray-300">{invoice.service}</td>
                    <td className="py-3 text-white font-mono">€{invoice.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {invoice.status === 'paid' ? 'E Paguar' : 'Pa Paguar'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{new Date(invoice.date).toLocaleDateString('sq-AL')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1a1c23] p-6 rounded-2xl border border-white/5 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6">Veprime të Shpejta</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickActionBtn href="/clients" icon={Users} label="Shto Klient" />
          <QuickActionBtn href="/invoices" icon={FileText} label="Krijo Faturë" />
          <QuickActionBtn href="/domains" icon={Globe} label="Shto Domën" />
          <QuickActionBtn href="/projects" icon={Rocket} label="Shto Projekt" />
        </div>
      </div>
    </div>
  );
}

// Components
function StatCard({ title, value, icon: IconComponent, color = 'text-blue-500', href }: StatCardProps) {
  const content = (
    <div className="bg-[#1a1c23] border border-white/5 p-6 rounded-2xl hover:border-[#cfa861]/20 transition-all cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        {IconComponent ? <IconComponent className={`w-8 h-8 ${color}`} /> : null}
      </div>
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

function ProgressItem({ label, percent }: ProgressItemProps) {
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

function QuickActionBtn({ href, icon: IconComponent, label }: QuickActionBtnProps) {
  return (
    <Link href={href} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center group">
      {IconComponent ? <IconComponent className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform text-[#cfa861]" /> : null}
      <p className="text-white font-medium text-sm">{label}</p>
    </Link>
  );
}
