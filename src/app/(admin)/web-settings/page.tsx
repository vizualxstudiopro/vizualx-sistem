'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WebConfig {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  announcement_text: string;
  announcement_active: boolean;
  popup_title: string;
  popup_text: string;
  popup_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function WebSettingsPage() {
  const [config, setConfig] = useState<WebConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchWebConfig();
  }, []);

  const fetchWebConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('website_config')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Row doesn't exist, create default one
          await createDefaultConfig();
        } else {
          console.error('Error fetching config:', error);
          setMessage({ type: 'error', text: 'Gabim në marrjen e konfigurimit' });
        }
      } else {
        setConfig(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage({ type: 'error', text: 'Ka ndodhur një gabim' });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('website_config')
        .insert([
          {
            id: 1,
            hero_title: 'Transformojmë Idetë në Realitet Dixhital',
            hero_subtitle: 'Zgjidhje komprehensive për biznesin tuaj në epokën dixhitale',
            hero_image_url: '',
            announcement_text: 'Mirëseerdhe në VizualX!',
            announcement_active: false,
            popup_title: 'Oferta Speciale',
            popup_text: 'Merrni 20% zbritje në shërbimin e parë.',
            popup_active: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating default config:', error);
        setMessage({ type: 'error', text: 'Gabim në krijimin e konfigurimit' });
      } else {
        setConfig(data);
      }
    } catch (err) {
      console.error('Unexpected error creating config:', err);
      setMessage({ type: 'error', text: 'Ka ndodhur një gabim' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof WebConfig, value: any) => {
    if (config) {
      setConfig({ ...config, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!config) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('website_config')
        .update({
          hero_title: config.hero_title,
          hero_subtitle: config.hero_subtitle,
          hero_image_url: config.hero_image_url,
          announcement_text: config.announcement_text,
          announcement_active: config.announcement_active,
          popup_title: config.popup_title,
          popup_text: config.popup_text,
          popup_active: config.popup_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (error) {
        console.error('Error saving config:', error);
        setMessage({ type: 'error', text: 'Gabim në ruajtjen e konfigurimit' });
      } else {
        setMessage({ type: 'success', text: 'Konfigurimi u ruajt me sukses!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error('Unexpected error saving:', err);
      setMessage({ type: 'error', text: 'Ka ndodhur një gabim' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-[#cfa861] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-8 bg-[#0f1115] min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>Nuk mund të ngarkohet konfigurimi. Ju lutemi provoni më vonë.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0f1115] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Konfigurimet e Web-it</h1>
          <p className="text-gray-400">Menaxho tekstet dhe komponentët e website-it publik</p>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            {message.text}
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Hero Section */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-[#1a1c23] border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#cfa861] rounded-full" />
                Seksioni Hero
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Titull Hero</label>
                  <input
                    type="text"
                    value={config.hero_title}
                    onChange={(e) => handleInputChange('hero_title', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:border-[#cfa861] focus:outline-none transition-colors"
                    placeholder="Futni titullin e hero-it"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Tekstin Ndihmës (Subtitle)</label>
                  <textarea
                    value={config.hero_subtitle}
                    onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:border-[#cfa861] focus:outline-none transition-colors resize-none"
                    rows={3}
                    placeholder="Futni tekstin ndihmës"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">URL e Imazhit Hero</label>
                  <input
                    type="url"
                    value={config.hero_image_url}
                    onChange={(e) => handleInputChange('hero_image_url', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:border-[#cfa861] focus:outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Announcement Bar */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-[#1a1c23] border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#cfa861] rounded-full" />
                Shiriti i Njoftimeve
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Teksti i Njoftimit</label>
                  <textarea
                    value={config.announcement_text}
                    onChange={(e) => handleInputChange('announcement_text', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:border-[#cfa861] focus:outline-none transition-colors resize-none"
                    rows={2}
                    placeholder="Futni tekstin e njoftimit"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-white font-medium">Aktivizo Njoftimin</label>
                  <button
                    onClick={() => handleInputChange('announcement_active', !config.announcement_active)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      config.announcement_active ? 'bg-[#cfa861]' : 'bg-white/10'
                    }`}
                  >
                    <motion.span
                      className="inline-block h-6 w-6 transform rounded-full bg-white"
                      animate={{ x: config.announcement_active ? 28 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  </button>
                  <span className="text-gray-400 text-sm">{config.announcement_active ? 'Aktiv' : 'Inaktiv'}</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Popup */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-[#1a1c23] border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#cfa861] rounded-full" />
                Dritarja Popup
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Titull Popup</label>
                  <input
                    type="text"
                    value={config.popup_title}
                    onChange={(e) => handleInputChange('popup_title', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:border-[#cfa861] focus:outline-none transition-colors"
                    placeholder="Futni titullin e popup-it"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Teksti Popup</label>
                  <textarea
                    value={config.popup_text}
                    onChange={(e) => handleInputChange('popup_text', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:border-[#cfa861] focus:outline-none transition-colors resize-none"
                    rows={3}
                    placeholder="Futni tekstin e popup-it"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-white font-medium">Aktivizo Popup</label>
                  <button
                    onClick={() => handleInputChange('popup_active', !config.popup_active)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      config.popup_active ? 'bg-[#cfa861]' : 'bg-white/10'
                    }`}
                  >
                    <motion.span
                      className="inline-block h-6 w-6 transform rounded-full bg-white"
                      animate={{ x: config.popup_active ? 28 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  </button>
                  <span className="text-gray-400 text-sm">{config.popup_active ? 'Aktiv' : 'Inaktiv'}</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Save Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-8 py-4 rounded-lg bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Po ruhet...' : 'Ruaj Ndryshimet'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
