'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PromoPopupProps {
  title: string;
  text: string;
  isActive: boolean;
}

export default function PromoPopup({ title, text, isActive }: PromoPopupProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return sessionStorage.getItem('promo-popup-dismissed') === 'true';
  });

  useEffect(() => {
    if (isActive && !dismissed) {
      // Show popup after a short delay
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isActive, dismissed]);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('promo-popup-dismissed', 'true');
  };

  if (!isActive || !title || !text) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Popup Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              {/* Header with Close Button */}
              <div className="relative h-2 bg-gradient-to-r from-[#cfa861] to-[#e8c96f]">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 -mt-2 p-2 rounded-lg bg-[#0f1115]/80 hover:bg-[#0f1115] border border-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-black text-white mb-4"
                >
                  {title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-300 mb-8 leading-relaxed"
                >
                  {text}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3"
                >
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-colors"
                  >
                    Mbyll
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 rounded-lg bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] font-bold transition-colors"
                  >
                    OK
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
