'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnnouncementBarProps {
  text: string;
  isActive: boolean;
}

export default function AnnouncementBar({ text, isActive }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isActive);
  }, [isActive]);

  if (!visible || !text) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full overflow-hidden"
      >
        <div className="bg-[#cfa861] text-[#0f1115] py-3 px-4 flex items-center justify-between">
          <p className="text-sm font-medium text-center flex-1">{text}</p>
          <button
            onClick={() => setVisible(false)}
            className="ml-4 p-1 hover:bg-[#0f1115]/10 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
