import { motion } from 'framer-motion';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white pt-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 text-white">Politika e Cookies</h1>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            Efektive nga data: 1 Janar 2026
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">1. Çfarë janë Cookies?</h2>
            <p className="text-gray-400 leading-relaxed">
              Cookies janë skedarë të vegjël teksti që vendosen në paisjen tuaj kur vizitoni website-in tonë. Ato ndihmojnë ne të kupto sjelljen tuaj dhe të përmirësojmë përvojën e përdoruesit.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">2. Llojet e Cookies që Ne Përdorim</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cookies të Domosdoshme</h3>
                <p className="text-gray-400">
                  Këto cookies janë thelbësore për funksionimin e website-it. Ato nuk mund të çaktivizohemi në paymim për ata.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cookies të Performancës</h3>
                <p className="text-gray-400">
                  Këto cookies na ndihmojnë të mbledhim informacionin mbi si përdorni website-in, përvojën tuaj të ngarkimit dhe më shumë.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cookies të Targetimit</h3>
                <p className="text-gray-400">
                  Këto cookies përdoren për të shfaqur reklama relevante të ndryshme bazuar në interesat tuaja.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">3. Si të Kontrolloni Cookies</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Shumica e shfletuesve lejojnë ju të kontrolloni cookies përmes cilësimeve tuaja. Megjithatë, çaktivizimi i cookies mund të ndikojë në funksionalitetin e website-it.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Për më shumë informacion mbi kontrollimin e cookies, vizitoni www.allaboutcookies.org
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-400 leading-relaxed">
              Website-i tonë mund të përmbajë linqe përnjë website-a të tjerë. Ne nuk kontrollojmë politikat e cookies të atyre website-ave.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">5. Ndryshimet e Politikës</h2>
            <p className="text-gray-400 leading-relaxed">
              Ne mund të përditësojmë këtë politikë në çdo kohë. Ju këshillojmë të rishikoni periodikisht për ndryshimet.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">6. Kontakti</h2>
            <p className="text-gray-400 leading-relaxed">
              Nëse keni pyetje për këtë politikë, na e-mail në suport@vizualx.online
            </p>
          </section>

          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-gray-500 text-sm">
              © 2026 VizualX. Të gjitha të drejtat e rezervuara.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
