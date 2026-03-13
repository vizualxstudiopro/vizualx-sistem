'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code, Palette, Smartphone, Phone, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type ContactStatus = {
  kind: 'success' | 'error';
  message: string;
} | null;

type PortfolioProject = {
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
};

type PortfolioProjectRow = {
  title: string;
  category: string | null;
  image_url: string | null;
  client_name: string | null;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    const details = error as { message?: string; details?: string; code?: string };
    return details.message || details.details || details.code || JSON.stringify(details);
  }

  return String(error);
}

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

const defaultProjects = [
  {
    title: 'Azalea Wine Cellar',
    category: 'Identitet Marke & Dizajn Etikete',
    description: 'Identitet elegant i markës dhe dizajn premium i etiketave për një koleksion verash luksozi.',
    image: '/portfolio/project-13.png',
    tags: ['Branding', 'Dizajn', 'Luksozi'],
  },
  {
    title: 'Kreshniku Transport',
    category: 'Platform Web Logjistike',
    description: 'Platformë moderne web për menaxhimin e logjistikës dhe ndjekjen në kohë reale.',
    image: '/portfolio/project-14.png',
    tags: ['Web Development', 'Platforma', 'Logjistika'],
  },
  {
    title: 'AUTO MANDI',
    category: 'Sistem ERP i Bazuar në Web',
    description: 'Zgjidhje komprehensive ERP për menaxhimin dhe operacionet e automobilistike.',
    image: '/portfolio/project-15.png',
    tags: ['Web Development', 'ERP', 'Enterprise'],
  },
  {
    title: "Arti i Zemrës",
    category: 'Social Media & Branding Artizan',
    description: 'Stratejia kompjete të mediave shoqeruese dhe branding për tregtimet artizanale.',
    image: '/portfolio/project-16.png',
    tags: ['Social Media', 'Branding', 'Strategji'],
  },
];

const services = [
  {
    icon: Code,
    title: 'Web Development & ERP',
    description: 'Faqe web me porosi, platforma logjistike dhe sisteme ERP në web duke përdorur teknologji moderne dhe arkitekturë skalabile.',
  },
  {
    icon: Palette,
    title: 'Identiteti i Brandit',
    description: 'Brandim i plotë, dizajn logoje, manual brandi dhe dizajn etiketash premium për identitetin vizual të kompletuar.',
  },
  {
    icon: Smartphone,
    title: 'Menaxhimi i Rrjeteve Sociale',
    description: 'Krijim përmbajtjeje vizuale, planifikim postimesh strategjike dhe dizajn për marketing dixhital i orientuar në konversion.',
  },
];

export default function Home() {
  const [projects, setProjects] = useState<PortfolioProject[]>(defaultProjects);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<ContactStatus>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [heroData, setHeroData] = useState({
    hero_title: 'Transformo Idetë në Realitet Dixhital',
    hero_subtitle: 'Ne krijojmë përvojat premium digjitale përmes Zhvillimit Web, Branding-ut dhe zgjidhjeve të Media Shoqeruese',
    hero_image_url: '',
  });

  useEffect(() => {
    const fetchWebConfig = async () => {
      const { data } = await supabase
        .from('website_config')
        .select('hero_title, hero_subtitle, hero_image_url')
        .eq('id', 1)
        .single();

      if (data) {
        setHeroData(data);
      }
    };

    fetchWebConfig();
  }, []);

  useEffect(() => {
    const fetchPublishedProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) {
          setProjects(defaultProjects);
        } else if (data && data.length > 0) {
          const mappedProjects: PortfolioProject[] = (data as PortfolioProjectRow[]).map((project) => ({
            title: project.title,
            category: project.category || 'Projekt',
            image: project.image_url || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            description: project.client_name ? `Projekt për ${project.client_name}` : 'Projekt me vlerë të lartë',
            tags: [project.category || 'Projekt'],
          }));
          setProjects(mappedProjects);
        } else {
          setProjects(defaultProjects);
        }
      } catch {
        setProjects(defaultProjects);
      }
    };

    fetchPublishedProjects();
  }, []);

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactStatus(null);

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({ kind: 'error', message: 'Plotësoni emrin, email-in dhe mesazhin.' });
      return;
    }

    try {
      setIsContactSubmitting(true);

      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          type: 'Lead i ri nga Website',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Dërgimi i njoftimit dështoi.');
      }

      setContactForm({ name: '', email: '', message: '' });
      setContactStatus({
        kind: 'success',
        message: result.warning
          ? `Mesazhi u ruajt dhe email-i u dërgua. Kujdes: ${result.warning}`
          : 'Mesazhi u dërgua me sukses. Do t’ju kontaktojmë së shpejti.',
      });
    } catch (error) {
      setContactStatus({
        kind: 'error',
        message: getErrorMessage(error),
      });
    } finally {
      setIsContactSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src="/portfolio/project-13.png"
            alt="VizualX Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1115]/80 via-transparent to-[#0f1115]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40">
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
            {heroData.hero_title.split('në').length > 1 ? (
              <>
                {heroData.hero_title.split('në')[0]}në{' '}
                <span className="bg-gradient-to-r from-[#cfa861] to-[#e8c96f] bg-clip-text text-transparent">
                  {heroData.hero_title.split('në')[1]}
                </span>
              </>
            ) : (
              heroData.hero_title
            )}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed"
            variants={fadeInUp}
          >
            {heroData.hero_subtitle}
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 pt-6" variants={fadeInUp}>
            <Link
              href="#portfolio"
              className="px-8 py-4 rounded-lg bg-[#cfa861] text-[#0f1115] font-bold text-lg hover:bg-[#e8c96f] transition-all duration-200 hover:shadow-lg hover:shadow-[#cfa861]/30 text-center"
            >
              Shiko Punën Tonë
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 rounded-lg border-2 border-[#cfa861] text-[#cfa861] font-bold text-lg hover:bg-[#cfa861]/10 transition-all duration-200 text-center"
            >
              Filloji Tani
            </Link>
          </motion.div>
        </motion.div>
        </div>
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
              Shërbimet Tona
            </motion.h2>
            <motion.p className="text-xl text-gray-400 max-w-2xl mx-auto" variants={fadeInUp}>
              Zgjidhje digjitale komprehensive të përshtatura me nevojat unikale të biznesit tuaj
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                  className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#cfa861] transition-all duration-300 hover:bg-white/8 hover:shadow-xl hover:shadow-[#cfa861]/10 cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                >
                  <div className="mb-6 inline-block p-3 rounded-xl bg-[#cfa861]/10 group-hover:bg-[#cfa861]/20 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-[#cfa861] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#cfa861] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
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
            Puna në Vëmendje
          </motion.h2>
          <motion.p className="text-xl text-gray-400 max-w-2xl mx-auto" variants={fadeInUp}>
            Paraqitja e projekteve tona më ndikuese në industrije të ndryshme
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
                style={project.image.startsWith('/') || project.image.startsWith('http') ? undefined : { background: project.image }}
              >
                {(project.image.startsWith('/') || project.image.startsWith('http')) && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
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
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <motion.div className="text-left" variants={fadeInUp}>
              <div className="mb-8 inline-block rounded-full border border-[#cfa861]/30 bg-[#cfa861]/10 px-6 py-2">
                <p className="text-sm font-semibold tracking-wide text-[#cfa861]">GATI PËR TË FILLUAR</p>
              </div>

              <h2 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
                Gati për të nisur{' '}
                <span className="bg-gradient-to-r from-[#cfa861] to-[#e8c96f] bg-clip-text text-transparent">
                  projektin tuaj?
                </span>
              </h2>

              <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
                Le të bashkëpunojmë për të transformuar vizionin tuaj në realitet. Dërgoni kërkesën tuaj dhe sistemi do të krijojë menjëherë një lead të ri për ekipin VizualX.
              </p>

              <div className="mb-8 space-y-4">
                <a
                  href="tel:+355696969348"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-4 transition-all duration-300 hover:border-[#cfa861]/50 hover:bg-white/10"
                >
                  <Phone className="h-5 w-5 text-[#cfa861]" />
                  <span className="font-semibold text-white transition-colors group-hover:text-[#cfa861]">
                    +355 69 69 69 348
                  </span>
                </a>
                <a
                  href="mailto:suport@vizualx.online"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-4 transition-all duration-300 hover:border-[#cfa861]/50 hover:bg-white/10"
                >
                  <Mail className="h-5 w-5 text-[#cfa861]" />
                  <span className="font-semibold text-white transition-colors group-hover:text-[#cfa861]">
                    suport@vizualx.online
                  </span>
                </a>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex rounded-lg border-2 border-[#cfa861] px-8 py-4 text-center text-lg font-bold text-[#cfa861] transition-all duration-200 hover:bg-[#cfa861]/10"
              >
                Hyrje në Dashboard
              </Link>
            </motion.div>

            <motion.div
              className="rounded-3xl border border-white/10 bg-[#111318] p-6 shadow-2xl shadow-black/30 md:p-8"
              variants={fadeInUp}
            >
              <h3 className="mb-2 text-2xl font-bold text-white">Dërgo Mesazh</h3>
              <p className="mb-6 text-sm text-gray-400">
                Pas ruajtjes në Supabase, sistemi dërgon edhe një njoftim automatik me email.
              </p>

              {contactStatus ? (
                <div
                  className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                    contactStatus.kind === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/30 bg-red-500/10 text-red-300'
                  }`}
                >
                  {contactStatus.message}
                </div>
              ) : null}

              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Emri</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(event) => setContactForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-[#0f1115] px-4 py-3 text-white outline-none transition-all focus:border-[#cfa861]"
                    placeholder="Emri juaj"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(event) => setContactForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-[#0f1115] px-4 py-3 text-white outline-none transition-all focus:border-[#cfa861]"
                    placeholder="email@kompania.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Mesazhi</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(event) => setContactForm((current) => ({ ...current, message: event.target.value }))}
                    className="min-h-[140px] w-full rounded-xl border border-white/10 bg-[#0f1115] px-4 py-3 text-white outline-none transition-all focus:border-[#cfa861]"
                    placeholder="Përshkruani shkurt projektin ose nevojën tuaj"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isContactSubmitting}
                  className="w-full rounded-xl bg-[#cfa861] px-6 py-4 text-lg font-bold text-[#0f1115] transition-all duration-200 hover:bg-[#e8c96f] hover:shadow-lg hover:shadow-[#cfa861]/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isContactSubmitting ? 'Duke dërguar...' : 'Dërgo Kërkesën'}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
