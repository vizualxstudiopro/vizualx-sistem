'use client';

import { motion } from 'framer-motion';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">Politika e Cookies</h1>
        <p className="text-gray-400 mb-12">Efektive nga: 1 Janar 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Çfarë janë Cookies?</h2>
            <p>
              Cookies janë skedarë teksti të vogla që ruhen në kompjuterin tuaj kur vizitoni faqet e internetit. Ato përdoren për të përmirësuar përvojën online tuaj dhe për të mbajtur informacionin rreth preferencave tuaja.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Të Cilat Cookies Përdorim Ne?</h2>
            <p className="mb-4">Ne përdorim tre lloje cokish:</p>
            <ul className="space-y-4 ml-4">
              <li>
                <strong className="text-white">Cookies të Nevojshme:</strong> Këto janë thelbësorë për të bërë faqen tonë të funksionojë siç duhet. Ato mund të përfshijnë autentifikimin dhe preferencat e sigurisë.
              </li>
              <li>
                <strong className="text-white">Cookies të Performance:</strong> Këto ndihmojnë në mbledhjen e të dhënave rreth përdorimit të faqes tonë për të përmirësuar shërbimin tonë.
              </li>
              <li>
                <strong className="text-white">Cookies Targeted:</strong> Këto përdoren për të shfaqur reklamime të përshtatshme bazuar në interesat tuaja.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Si të Kontrolloni Cookies</h2>
            <p>
              Shumica e shfletuesve ju lejojnë të kontrolloni cookies përmes çdo nxjerrjeje mireloje. Për më shumë informacion, vizitoni{' '}
              <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#cfa861] hover:text-[#e8c96f] transition-colors">
                www.allaboutcookies.org
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies Palësh të Tretë</h2>
            <p>
              Faqja jonë mund të përmbajë lidhje me faqet e të tretëve. Ju lutemi kuptoni se ne nuk jemi përgjegjës për praktikat e privatësisë ose cookies të këtyre faqeve.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Ndryshimet në Politikën e Cookies</h2>
            <p>
              Ne mund të përditësojmë këtë politikë nga koha në kohë. Ju do të informoheni për çdo ndryshim të madh përmes një njoftimi në faqen tonë.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Kontakti</h2>
            <p>
              Nëse keni pyetje rreth kësaj politike të cookies, ju lutemi na kontaktoni në{' '}
              <a href="mailto:suport@vizualx.online" className="text-[#cfa861] hover:text-[#e8c96f] transition-colors">
                suport@vizualx.online
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© 2026 VizualX. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </motion.div>
    </div>
  );
}
