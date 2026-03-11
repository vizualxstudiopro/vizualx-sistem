'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/web/Navbar';
import Footer from '@/components/web/Footer';
import CookieBanner from '@/components/web/CookieBanner';
import AnnouncementBar from '@/components/web/AnnouncementBar';
import PromoPopup from '@/components/web/PromoPopup';
import AnalyticsTracker from '@/components/web/AnalyticsTracker';
import { supabase } from '@/lib/supabase';

interface WebConfig {
  announcement_text: string;
  announcement_active: boolean;
  popup_title: string;
  popup_text: string;
  popup_active: boolean;
}

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [webConfig, setWebConfig] = useState<WebConfig | null>(null);

  useEffect(() => {
    const fetchWebConfig = async () => {
      const { data } = await supabase
        .from('website_config')
        .select('announcement_text, announcement_active, popup_title, popup_text, popup_active')
        .eq('id', 1)
        .single();

      if (data) {
        setWebConfig(data);
      }
    };

    fetchWebConfig();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('website_config_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_config',
          filter: 'id=eq.1',
        },
        (payload) => {
          if (payload.new) {
            setWebConfig(payload.new as WebConfig);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AnalyticsTracker />
      {webConfig && <AnnouncementBar text={webConfig.announcement_text} isActive={webConfig.announcement_active} />}
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <CookieBanner />
      {webConfig && (
        <PromoPopup
          title={webConfig.popup_title}
          text={webConfig.popup_text}
          isActive={webConfig.popup_active}
        />
      )}
    </div>
  );
}
