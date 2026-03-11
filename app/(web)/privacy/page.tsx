'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">Politika e Privatësisë</h1>
        <p className="text-gray-400 mb-12">Efektive nga: 1 Janar 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Hyrje</h2>
            <p>
              VizualX (&quot;ne&quot;, &quot;joni&quot;, ose &quot;ne&quot;) ofron këtë politikë të privatësisë për të informuar ju rreth politikave dhe procedurave tona të mbledhjes, përdorimit dhe zbulimit të informacionit tuaj personal kur përdorni faqen tonë të internetit dhe të na kontaktoni.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Mbledhja e Informacionit</h2>
            <p>Ne mbledhim informacione për të cilat ju na furnizoni drejt drejtpërdrejt, si p.sh.:</p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Emri juaj dhe informacioni i kontaktit (email, numri i telefonit)</li>
              <li>Informacioni i kompanisë</li>
              <li>Të dhënat e navigimit të faqes</li>
              <li>Preferencat tuaja</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Përdorimi i Informacionit</h2>
            <p>Ne përdorim informacionin tuaj për të:</p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Ofruar dhe mirëmbajtjen e shërbimeve tona</li>
              <li>Ju komunikor lidhur me shërbimin</li>
              <li>Përmirësimin e përvojës tuaj</li>
              <li>Analiza dhe raportim për një përdorim të përgjithshëm.</li>
              <li>Përputhje me kërkesave ligjore</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Siguresia</h2>
            <p>
              Ne përdorim enkriptimin SSL dhe masa të tjera sigurie për të mbrojtur informacionin tuaj personal. Megjithatë, asnjë metodë transmetimi përmes Internetit nuk është 100% e sigurt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Të Drejtat Tuaja</h2>
            <p>Ju keni të drejtën të:</p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Të përdorni kopje të informacionit tuaj personal</li>
              <li>Të kërkoni korrigjimet e të dhënave tuaja</li>
              <li>Të kërkoni fshirjen e të dhënave tuaja</li>
              <li>Të kundërshtoni përpunimin e të dhënave tuaja</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Kontakti</h2>
            <p>
              Nëse keni pyetje rreth kësaj politike të privatësisë, ju lutemi na kontaktoni në{' '}
              <a href="mailto:suport@vizualx.online" className="text-[#cfa861] hover:text-[#e8c96f] transition-colors">
                suport@vizualx.online
              </a>{' '}
              ose në +355 69 69 69 348.
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
