'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight, Facebook, Instagram, MessageCircle } from 'lucide-react';

function LinkItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center text-gray-400 hover:text-[#cfa861] transition-colors duration-200 text-sm"
    >
      {label}
      <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-[#0a0c10] border-t border-white/5">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <motion.div className="flex flex-col gap-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">
                VIZUAL<span className="text-[#cfa861]">X</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Transformojmë idetë në kryevepra dixhitale të mahnitshme. Nga branding deri në sistemet komplekse ERP.
            </p>
            <div className="flex gap-3 pt-4">
              <motion.a
                href="https://www.facebook.com/vizualx.io"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#cfa861]/10 border border-white/10 hover:border-[#cfa861]/30 flex items-center justify-center text-gray-400 hover:text-[#cfa861] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/vizualix.online/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#cfa861]/10 border border-white/10 hover:border-[#cfa861]/30 flex items-center justify-center text-gray-400 hover:text-[#cfa861] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://wa.me/355696969348"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#cfa861]/10 border border-white/10 hover:border-[#cfa861]/30 flex items-center justify-center text-gray-400 hover:text-[#cfa861] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Column 2: Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-6 text-lg">Shërbimet</h3>
            <div className="space-y-3">
              <LinkItem href="/services#web-development" label="Web Development & ERP" />
              <LinkItem href="/services#branding" label="Identitet Brandi" />
              <LinkItem href="/services#social-media" label="Social Media Management" />
              <LinkItem href="/services#media-restoration" label="Restaurim Mediatik" />
            </div>
          </motion.div>

          {/* Column 3: Company */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-6 text-lg">Kompania</h3>
            <div className="space-y-3">
              <LinkItem href="/#portfolio" label="Portofoli" />
              <LinkItem href="/services" label="Shërbimet" />
              <LinkItem href="/#contact" label="Kontakti" />
              <LinkItem href="/privacy" label="Privatësia" />
            </div>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-6 text-lg">Kontakti</h3>
            <div className="space-y-4">
              <a
                href="mailto:suport@vizualx.online"
                className="group flex items-start gap-3 text-sm text-gray-400 hover:text-[#cfa861] transition-colors"
              >
                <Mail className="w-5 h-5 text-[#cfa861] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="text-gray-400">suport@vizualx.online</p>
                </div>
              </a>
              <a
                href="tel:+355696969348"
                className="group flex items-start gap-3 text-sm text-gray-400 hover:text-[#cfa861] transition-colors"
              >
                <Phone className="w-5 h-5 text-[#cfa861] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Telefon</p>
                  <p className="text-gray-400">+355 69 69 69 348</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"
          variants={itemVariants}
        />

        {/* Bottom Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm">
            © {currentYear} VizualX. Të gjitha të drejtat e rezervuara.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-[#cfa861] text-sm transition-colors duration-200">
              Politika e Privatësisë
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-[#cfa861] text-sm transition-colors duration-200">
              Politika e Cookies
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
