'use client';

import { motion } from 'framer-motion';
import { Code, Palette, Share2, Image } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      id: 'web-development',
      icon: Code,
      title: 'Web Development & Sistemet ERP',
      description: 'Zhvillojmë faqe web të personalizuara dhe sisteme ERP të fuqishme për të optimizuar operacionet tuaja.',
      features: [
        'Faqe web e përshtatshme dhe responsive',
        'Sistemet e menaxhimit të biznesit (ERP)',
        'Platformat e obshtimeve dhe logistikës',
        'Integrimi me database-a komplekse',
        'API development dhe integrimi',
        'Siguresia dhe enkriptimi i të dhënave',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'branding',
      icon: Palette,
      title: 'Identitet Brandi & Dizajn',
      description: 'Ndërtojmë identitete vizuale të fuqishme që bënin më të dallueshëm biznesin tuaj në treg.',
      features: [
        'Dizajn e ligjit dhe vizual të markës',
        'Sistemi i ngjyrave dhe tipografisë',
        'Dizajn i etiketave dhe paketimit',
        'Materiale të marketingut të printimit',
        'Direktivat e markës',
        'Propozimet e materi branding',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'social-media',
      icon: Share2,
      title: 'Menaxhimi i Mediave Sociale',
      description: 'Rritni praninë tuaj në media sociale me strategjën tona të bazuar në të dhëna dhe përmbajtje të cilësisë së lartë.',
      features: [
        'Planifikimi i strategjisë sociale',
        'Krijimi dhe dizajni i përmbajtjes',
        'Planifikimi i postimeve dhe shpërndarja',
        'Menaxhimi i komunitetit dhe interakcionit',
        'Analiza dhe raportimi',
        'Kampanja dhe reklamimi i targetuar',
      ],
      color: 'from-rose-500 to-orange-500',
    },
    {
      id: 'media-restoration',
      icon: Image,
      title: 'Restaurim dhe Përpunim Mediatik',
      description: 'Restaurojmë dhe përmirësojmë fotografi, video dhe media të tjera për të maksimizuar cilësinë.',
      features: [
        'Restaurimi i fotografive të vjetra',
        'Reparimi dhe pastrimi i imazheve',
        'Rregullimi i ngjyrave dhe ndriçimit',
        'Përmirësimi i rezolucionit',
        'Përpunim video profesional',
        'Produksioni i përmbajtjes vizuale',
      ],
      color: 'from-emerald-500 to-teal-500',
    },
  ];

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
    <div className="min-h-screen bg-[#0f1115]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Shërbimet Tona
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Zgjidhje dixhitale komprehensive të përshtatura për të përmbushur nevojat unike të biznesit tuaj
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.id}
                  id={service.id}
                  className="group bg-[#1a1c23] border border-white/5 rounded-2xl p-8 hover:border-[#cfa861]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#cfa861]/10"
                  variants={itemVariants}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#cfa861] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-8">
                    {service.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <span className="w-5 h-5 rounded-full bg-[#cfa861]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-[#cfa861]" />
                        </span>
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/#contact"
                      className="inline-block px-6 py-2.5 rounded-lg bg-[#cfa861] text-[#0f1115] font-bold text-sm hover:bg-[#e8c96f] transition-all duration-200"
                    >
                      Kontaktoni Për Detaje
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-6">
              Pse të Zgjidhni VizualX?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Ne kombinojmë ekspertizën teknike me qasjen kreative për të dhënë rezultate të jashtëzakonshme.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { title: 'Ekspertizë', desc: 'Ekipi ynë ka më shumë se 10 vite përvojë në industri.' },
              { title: 'Fokus në Rezultate', desc: 'Ne nuk përfundojmë derisa të mos shohim ROI konkrete.' },
              { title: 'Mbështetje 24/7', desc: 'Ne jemi këtu për tu ndihmuar në çdo hap të rrugës.' },
              { title: 'Teknologji Moderne', desc: 'Përdorim teknologjitë më të fundit dhe më të mira.' },
              { title: 'Shkallëzim', desc: 'Rriten me biznesin tuaj pa probleme ose komplikime.' },
              { title: 'Transparencë', desc: 'Komunikim i hapur dhe raporte të rregullta të progresit.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-[#1a1c23] border border-white/5 rounded-xl p-6 hover:border-[#cfa861]/30 transition-all duration-300"
                variants={itemVariants}
              >
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-6">
              Gati për të Transformuar Biznesin Tuaj?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Kontaktoni ne sot dhe le të diskutojmë se si mund ta ndihmojmë.
            </p>
            <motion.div
              className="flex gap-4 justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/#contact"
                className="px-8 py-4 rounded-lg bg-[#cfa861] text-[#0f1115] font-bold text-lg hover:bg-[#e8c96f] transition-all duration-200"
              >
                Filloji Tani
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
