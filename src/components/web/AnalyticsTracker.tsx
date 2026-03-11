'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Skip tracking if pathname is from admin section
        if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
          return;
        }

        // Generate or retrieve session ID
        let sessionId = localStorage.getItem('vizualx_session_id');
        
        if (!sessionId) {
          // Generate a unique session ID
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('vizualx_session_id', sessionId);
        }

        // Insert page visit record
        const { error } = await supabase.from('site_visits').insert([
          {
            page_path: pathname,
            session_id: sessionId,
            visited_at: new Date().toISOString(),
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          },
        ]);

        if (error) {
          // Silently fail — table may not exist yet
        }
      } catch {
        // Silently fail — don't break UI if analytics fails
      }
    };

    trackPageView();
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
