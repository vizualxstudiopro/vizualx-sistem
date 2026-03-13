'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SiteVisit {
  id: number;
  page_path: string;
  session_id: string;
  visited_at: string;
  user_agent: string | null;
}

interface SiteVisitRow {
  id: number;
  page_path: string;
  session_id: string;
  created_at: string;
  user_agent: string | null;
}

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  recentVisits: SiteVisit[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch all visits with error handling
      const { data: allVisits, error: visitsError } = await supabase
        .from('site_visits')
        .select('id, page_path, session_id, user_agent, created_at')
        .order('created_at', { ascending: false });

      if (visitsError) {
        // Show helpful message about schema
        if (visitsError.message?.includes('does not exist')) {
          setMessage({
            type: 'error',
            text: `Gabim Skeme: ${visitsError.message}. Ju lutemi drejtojuni SQL Editor-it në Supabase dhe ekzekutoni SQL-in e saktë.`,
          });
        } else if (visitsError.message?.includes('column')) {
          setMessage({
            type: 'error',
            text: `Kolona nuk ekziston: ${visitsError.message}. Kontrolloni skemën e tabelës site_visits.`,
          });
        } else {
          setMessage({
            type: 'error',
            text: 'Nuk mund të merren të dhënat analitike. Kontrolloni konfigurimin e Supabase.',
          });
        }

        setAnalytics({
          totalVisits: 0,
          uniqueVisitors: 0,
          todayVisits: 0,
          recentVisits: [],
        });
        return;
      }

      const visits: SiteVisit[] = ((allVisits || []) as SiteVisitRow[]).map((visit) => ({
        id: visit.id,
        page_path: visit.page_path,
        session_id: visit.session_id,
        user_agent: visit.user_agent,
        visited_at: visit.created_at,
      }));

      // Calculate metrics
      const totalVisits = visits.length;
      const uniqueVisitors = new Set(visits.map((v) => v.session_id)).size;

      // Get today's date in ISO format
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayVisits = visits.filter((v) => new Date(v.visited_at).getTime() >= today.getTime()).length;

      // Get recent visits (last 20)
      const recentVisits = visits.slice(0, 20);

      setAnalytics({
        totalVisits,
        uniqueVisitors,
        todayVisits,
        recentVisits,
      });

      // Clear error message on success
      setMessage(null);
    } catch {
      setMessage({
        type: 'error',
        text: 'Ka ndodhur një gabim në marrjen e të dhënave.',
      });
      setAnalytics({
        totalVisits: 0,
        uniqueVisitors: 0,
        todayVisits: 0,
        recentVisits: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-[#0f1115] min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-[#cfa861] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-4 md:p-8 bg-[#0f1115] min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>Nuk ka të dhëna analitike të disponueshme.</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="p-4 md:p-8 bg-[#0f1115] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Error Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'error'
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'bg-green-500/10 border border-green-500/30 text-green-400'
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {message.text}
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-black text-white mb-2">Analitikat</h1>
          <p className="text-gray-400">Monitori i përdorimit të website-it publik</p>
          <p className="text-xs text-gray-500 mt-2">Përditësohet çdo 30 sekonda</p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Total Visits Card */}
          <motion.div
            className="bg-[#1a1c23] border border-white/5 rounded-2xl p-8 hover:border-[#cfa861]/30 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Total Vizita</p>
                <motion.p
                  className="text-4xl font-black text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {analytics.totalVisits.toLocaleString()}
                </motion.p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#cfa861]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#cfa861]" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Të gjitha vizitat e regjistruara</p>
          </motion.div>

          {/* Unique Visitors Card */}
          <motion.div
            className="bg-[#1a1c23] border border-white/5 rounded-2xl p-8 hover:border-[#cfa861]/30 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Vizitorë Unikë</p>
                <motion.p
                  className="text-4xl font-black text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {analytics.uniqueVisitors.toLocaleString()}
                </motion.p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Sesionet unike të identifikuara</p>
          </motion.div>

          {/* Today's Visits Card */}
          <motion.div
            className="bg-[#1a1c23] border border-white/5 rounded-2xl p-8 hover:border-[#cfa861]/30 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Sot</p>
                <motion.p
                  className="text-4xl font-black text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {analytics.todayVisits.toLocaleString()}
                </motion.p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Vizitat në 24 orët e fundit</p>
          </motion.div>
        </motion.div>

        {/* Recent Visits Table */}
        <motion.div
          className="bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-8 border-b border-white/5">
            <h2 className="text-2xl font-bold text-white">Vizitat e Fundit</h2>
            <p className="text-gray-400 text-sm mt-1">20 vizitat më të fundit</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="px-8 py-4 text-left text-gray-400 font-medium">Ora</th>
                  <th className="px-8 py-4 text-left text-gray-400 font-medium">Faqja</th>
                  <th className="px-8 py-4 text-left text-gray-400 font-medium">Session ID</th>
                  <th className="px-8 py-4 text-left text-gray-400 font-medium">Browser</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentVisits.map((visit, index) => {
                  const visitTime = new Date(visit.visited_at);
                  const displayTime = visitTime.toLocaleTimeString('sq-AL', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  // Extract browser info
                  let browserInfo = 'Unknown';
                  if (visit.user_agent) {
                    if (visit.user_agent.includes('Chrome')) browserInfo = 'Chrome';
                    else if (visit.user_agent.includes('Firefox')) browserInfo = 'Firefox';
                    else if (visit.user_agent.includes('Safari')) browserInfo = 'Safari';
                    else if (visit.user_agent.includes('Edge')) browserInfo = 'Edge';
                  }

                  return (
                    <motion.tr
                      key={visit.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <td className="px-8 py-4 text-gray-300">{displayTime}</td>
                      <td className="px-8 py-4">
                        <code className="px-3 py-1 rounded-lg bg-[#0f1115] border border-white/5 text-[#cfa861] text-xs">
                          {visit.page_path}
                        </code>
                      </td>
                      <td className="px-8 py-4 text-gray-400 text-xs font-mono">
                        {visit.session_id.substring(0, 20)}...
                      </td>
                      <td className="px-8 py-4 text-gray-400">{browserInfo}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {analytics.recentVisits.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <p>Nuk ka vizita të regjistruara ende.</p>
            </div>
          )}
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={fetchAnalyticsData}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Përditëso Tani
          </button>
        </motion.div>
      </div>
    </div>
  );
}
