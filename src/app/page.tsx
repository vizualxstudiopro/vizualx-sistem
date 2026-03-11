'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Palette, Sparkles, Smartphone, Briefcase } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const projects = [
  {
    title: 'Azalea Wine Cellar',
    category: 'Brand Identity & Label Design',
    description: 'Elegant brand identity and premium label design for a luxury wine collection.',
    image: 'linear-gradient(135deg, #8b5e3f 0%, #d4a574 100%)',
    tags: ['Branding', 'Design', 'Luxury'],
  },
  {
    title: 'Kreshniku Transport',
    category: 'Logistics Web Platform',
    description: 'Modern web platform for logistics management and real-time tracking.',
    image: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    tags: ['Web Development', 'Platform', 'Logistics'],
  },
  {
    title: 'AUTO MANDI',
    category: 'Web-based ERP System',
    description: 'Comprehensive ERP solution for automotive management and operations.',
    image: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    tags: ['Web Development', 'ERP', 'Enterprise'],
  },
  {
    title: "Arti i Zemrës",
    category: 'Artisan Social Media & Branding',
    description: 'Complete social media strategy and branding for artisan marketplace.',
    image: 'linear-gradient(135deg, #c084fc 0%, #e879f9 100%)',
    tags: ['Social Media', 'Branding', 'Strategy'],
  },
];

const services = [
  {
    icon: Palette,
    title: 'Web Development & ERP',
    description: 'Custom, high-performance websites built with modern technologies.',
  },
  {
    icon: Sparkles,
    title: 'Identiteti i Brandit',
    description: 'Strategic brand identity and visual design that sets you apart.',
  },
  {
    icon: Smartphone,
    title: 'Menaxhimi i Rrjeteve Sociale',
    description: 'Engaging content strategy and management across all platforms.',
  },
  {
    icon: Briefcase,
    title: 'Digital Solutions',
    description: 'Enterprise-grade ERP and custom software solutions.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          className="space-y-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-black tracking-tight leading-tight"
            variants={fadeInUp}
          >
            Transforming Ideas into{' '}
            <span className="bg-gradient-to-r from-[#cfa861] to-[#e8c96f] bg-clip-text text-transparent">
              Digital Masterpieces
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed"
            variants={fadeInUp}
          >
            We craft premium digital experiences through Web Development, Branding, and Social Media solutions
            that elevate your business to extraordinary heights.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 pt-6" variants={fadeInUp}>
            <Link
              href="#portfolio"
              className="px-8 py-4 rounded-lg bg-[#cfa861] text-[#0f1115] font-bold text-lg hover:bg-[#e8c96f] transition-all duration-200 hover:shadow-lg hover:shadow-[#cfa861]/30 text-center"
            >
              View Our Work
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 rounded-lg border-2 border-[#cfa861] text-[#cfa861] font-bold text-lg hover:bg-[#cfa861]/10 transition-all duration-200 text-center"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-[#0a0c10] py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="text-4xl md:text-5xl font-black mb-6" variants={fadeInUp}>
              Our Services
            </motion.h2>
            <motion.p className="text-xl text-gray-400 max-w-2xl mx-auto" variants={fadeInUp}>
              Comprehensive digital solutions tailored to your unique business needs
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  className="p-8 rounded-2xl bg-[#1a1c23] border border-white/5 hover:border-[#cfa861]/30 transition-all duration-300 group cursor-pointer"
                  variants={fadeInUp}
                >
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {IconComponent && <IconComponent className="w-12 h-12 text-[#cfa861]" />}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 className="text-4xl md:text-5xl font-black mb-6" variants={fadeInUp}>
            Featured Work
          </motion.h2>
          <motion.p className="text-xl text-gray-400 max-w-2xl mx-auto" variants={fadeInUp}>
            Showcasing our most impactful projects across diverse industries
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-white/5 hover:border-[#cfa861]/30 transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -8 }}
            >
              {/* Project Image/Gradient */}
              <div
                className="h-64 md:h-80 relative overflow-hidden"
                style={{ background: project.image }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              </div>

              {/* Project Content */}
              <div className="p-6 md:p-8 bg-[#1a1c23]">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#cfa861] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#cfa861] font-semibold text-sm mb-3">{project.category}</p>
                <p className="text-gray-400 mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-[#cfa861]/10 text-[#cfa861]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="bg-[#0a0c10] py-20 md:py-32">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 className="text-4xl md:text-5xl font-black mb-6" variants={fadeInUp}>
            Ready to Transform Your Vision?
          </motion.h2>

          <motion.p className="text-xl text-gray-400 mb-8" variants={fadeInUp}>
            Let's create something extraordinary together. Reach out today to discuss your project.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeInUp}>
            <a
              href="mailto:info@vizualx.com"
              className="px-8 py-4 rounded-lg bg-[#cfa861] text-[#0f1115] font-bold text-lg hover:bg-[#e8c96f] transition-all duration-200 hover:shadow-lg hover:shadow-[#cfa861]/30"
            >
              Get in Touch
            </a>
            <Link
              href="/login"
              className="px-8 py-4 rounded-lg border-2 border-[#cfa861] text-[#cfa861] font-bold text-lg hover:bg-[#cfa861]/10 transition-all duration-200"
            >
              Client Login
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}