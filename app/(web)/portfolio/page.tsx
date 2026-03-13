'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const images = [
  { src: '/portfolio/project-13.png', alt: 'VizualX Project 1' },
  { src: '/portfolio/project-14.png', alt: 'VizualX Project 2' },
  { src: '/portfolio/project-15.png', alt: 'VizualX Project 3' },
  { src: '/portfolio/project-16.png', alt: 'VizualX Project 4' },
  { src: '/portfolio/project-17.png', alt: 'VizualX Project 5' },
  { src: '/portfolio/project-18.png', alt: 'VizualX Project 6' },
  { src: '/portfolio/project-19.png', alt: 'VizualX Project 7' },
  { src: '/portfolio/project-20.png', alt: 'VizualX Project 8' },
  { src: '/portfolio/project-21.png', alt: 'VizualX Project 9' },
  { src: '/portfolio/project-22.png', alt: 'VizualX Project 10' },
  { src: '/portfolio/project-23.png', alt: 'VizualX Project 11' },
  { src: '/portfolio/project-24.png', alt: 'VizualX Project 12' },
  { src: '/portfolio/project-25.png', alt: 'VizualX Project 13' },
  { src: '/portfolio/project-26.png', alt: 'VizualX Project 14' },
  { src: '/portfolio/project-27.png', alt: 'VizualX Project 15' },
  { src: '/portfolio/project-28.png', alt: 'VizualX Project 16' },
  { src: '/portfolio/project-29.png', alt: 'VizualX Project 17' },
  { src: '/portfolio/project-30.png', alt: 'VizualX Project 18' },
  { src: '/portfolio/project-31.png', alt: 'VizualX Project 19' },
  { src: '/portfolio/project-32.png', alt: 'VizualX Project 20' },
  { src: '/portfolio/project-33.png', alt: 'VizualX Project 21' },
  { src: '/portfolio/project-35.png', alt: 'VizualX Project 22' },
];

type MediaAssetRow = {
  file_url: string | null;
  project_name: string | null;
};

export default function PortfolioPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState(images);

  useEffect(() => {
    const fetchPublishedPortfolio = async () => {
      try {
        const { data, error } = await supabase
          .from('media_assets')
          .select('file_url, project_name')
          .eq('category', 'portfolio')
          .order('created_at', { ascending: false });

        if (error) return;

        const mapped = ((data as MediaAssetRow[] | null) || [])
          .filter((item) => !!item.file_url)
          .map((item, index) => ({
            src: item.file_url as string,
            alt: item.project_name || `VizualX Project ${index + 1}`,
          }));

        if (mapped.length > 0) {
          setGalleryImages(mapped);
        }
      } catch {
      }
    };

    fetchPublishedPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-black text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Portofoli Ynë
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Zgjidhje kreative dixhitale — Web, Branding, ERP & Social Media
        </motion.p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {galleryImages.map((img) => (
            <motion.div
              key={img.src}
              className="group cursor-pointer overflow-hidden rounded-xl border border-white/5 hover:border-[#cfa861]/40 transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(img.src)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      {selected && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
            onClick={() => setSelected(null)}
          >
            <X size={32} />
          </button>
          <motion.img
            src={selected}
            alt="Portfolio fullscreen"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </div>
  );
}
