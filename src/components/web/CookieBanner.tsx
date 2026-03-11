'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('vizualx-cookie-consent');
    if (!cookieConsent) {
      // Show banner after 1 second
      const timer = setTimeout(() => setShown(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vizualx-cookie-consent', 'accepted');
    setShown(false);
  };

  const handleReject = () => {
    localStorage.setItem('vizualx-cookie-consent', 'rejected');
    setShown(false);
  };

  const handleClose = () => {
    setShown(false);
  };

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-40"
        >
          <div className="bg-[#1a1c23] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md bg-opacity-95">
            {/* Close Button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Content */}
            <div className="pr-6">
              <h3 className="text-white font-bold mb-2">Cookies</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Ne përdorim cookies për të përmirësuar përvojën tuaj në website. Këto ndihmojnë ne të kupto sjelljet tuaja dhe të optimizojmë shërbimet tona.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleReject}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-300 text-sm font-medium hover:border-white/20 hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Refuzoj
              </motion.button>
              <motion.button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#cfa861] text-[#0f1115] text-sm font-bold hover:bg-[#e8c96f] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Pranoj
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
