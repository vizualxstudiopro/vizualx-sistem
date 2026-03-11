'use client';

import Image, { type ImageLoaderProps } from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WebConfig {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_image_ratio: string;
  announcement_text: string;
  announcement_active: boolean;
  popup_title: string;
  popup_text: string;
  popup_active: boolean;
  created_at: string;
  updated_at: string;
}

const ASPECT_RATIOS = [
  { label: 'Katror (1:1)', value: '1:1', description: 'Profil, Social Media' },
  { label: 'Portrat (9:16)', value: '9:16', description: 'Mobile, Vertikal' },
  { label: 'Senator (3:2)', value: '3:2', description: 'Fotografi Klasike' },
  { label: 'Panoramë (4:3)', value: '4:3', description: 'Monitor Standard' },
  { label: 'Widescreen (16:9)', value: '16:9', description: 'HD, Film' },
  { label: 'Ultra-Wide (21:9)', value: '21:9', description: 'Kino, Hero' },
];

const remoteImageLoader = ({ src }: ImageLoaderProps) => src;

export default function WebSettingsPage() {
  const [config, setConfig] = useState<WebConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const createDefaultConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('website_config')
        .insert([
          {
            id: 1,
            hero_title: 'Transformojmë Idetë në Realitet Dixhital',
            hero_subtitle: 'Zgjidhje komprehensive për biznesin tuaj në epokën dixhitale',
            hero_image_url: '',
            hero_image_ratio: '16:9',
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
        setMessage({ type: 'error', text: 'Gabim në krijimin e konfigurimit' });
      } else {
        setConfig(data);
      }
    } catch {
      setMessage({ type: 'error', text: 'Ka ndodhur një gabim' });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWebConfig = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('website_config')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          await createDefaultConfig();
        } else {
          setMessage({ type: 'error', text: 'Gabim në marrjen e konfigurimit' });
        }
      } else {
        setConfig(data);
      }
    } catch {
      setMessage({ type: 'error', text: 'Ka ndodhur një gabim' });
    } finally {
      setLoading(false);
    }
  }, [createDefaultConfig]);

  useEffect(() => {
    void fetchWebConfig();
  }, [fetchWebConfig]);

  const handleInputChange = <K extends keyof WebConfig>(field: K, value: WebConfig[K]) => {
    if (config) {
      setConfig({ ...config, [field]: value });
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setSaving(true);
      const timestamp = Date.now();
      const fileName = `hero-${timestamp}-${file.name.replace(/\s+/g, '-')}`;

      const { error } = await supabase.storage
        .from('website-images')
        .upload(`hero/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        setMessage({ type: 'error', text: 'Gabim në ngarkim të imazhit' });
        return;
      }

      const { data: publicData } = supabase.storage
        .from('website-images')
        .getPublicUrl(`hero/${fileName}`);

      if (config && publicData?.publicUrl) {
        setConfig({
          ...config,
          hero_image_url: publicData.publicUrl,
        });
        setMessage({ type: 'success', text: 'Imazhi u ngarkua me sukses!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch {
      setMessage({ type: 'error', text: 'Ka ndodhur një gabim gjatë ngarkimit' });
    } finally {
      setSaving(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
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
          hero_image_ratio: config.hero_image_ratio,
          announcement_text: config.announcement_text,
          announcement_active: config.announcement_active,
          popup_title: config.popup_title,
          popup_text: config.popup_text,
          popup_active: config.popup_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (error) {
        setMessage({ type: 'error', text: 'Gabim në ruajtjen e konfigurimit' });
      } else {
        setMessage({ type: 'success', text: 'Konfigurimi u ruajt me sukses!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch {
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
                  <label className="block text-white font-medium mb-2">Imazhi i Hero-it</label>
                  
                  {/* Upload Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="relative border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#cfa861]/50 transition-colors cursor-pointer bg-white/2"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-8 h-8 text-[#cfa861]" />
                      <div>
                        <p className="text-white font-medium">Zvarrit imazhin këtu ose kliko për të zgjedhur</p>
                        <p className="text-gray-400 text-sm mt-1">PNG, JPG, WebP (Maksimum 5MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {config.hero_image_url && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 relative"
                    >
                      <div className="relative rounded-lg overflow-hidden border border-white/10">
                        <Image
                          loader={remoteImageLoader}
                          unoptimized
                          src={config.hero_image_url}
                          alt="Preview"
                          width={1600}
                          height={900}
                          className="h-auto w-full object-cover"
                          style={{
                            aspectRatio: config.hero_image_ratio,
                          }}
                        />
                        <button
                          onClick={() => handleInputChange('hero_image_url', '')}
                          className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {config.hero_image_url.split('/').pop()}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Aspect Ratio Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">Përmasat (Aspect Ratio)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ASPECT_RATIOS.map((ratio) => (
                      <motion.button
                        key={ratio.value}
                        onClick={() => handleInputChange('hero_image_ratio', ratio.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          config.hero_image_ratio === ratio.value
                            ? 'border-[#cfa861] bg-[#cfa861]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <p className="font-medium text-white">{ratio.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{ratio.description}</p>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    E zgjedhur: <span className="text-[#cfa861]">{config.hero_image_ratio}</span>
                  </p>
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
