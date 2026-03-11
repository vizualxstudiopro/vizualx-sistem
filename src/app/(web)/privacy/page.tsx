import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white pt-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 text-white">Politika e Privatësisë</h1>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            Efektive nga data: 1 Janar 2026
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">1. Hyrje</h2>
            <p className="text-gray-400 leading-relaxed">
              VizualX (në tekstin e mëposhtëm "ne", "nesh" ose "kompania") është i pranuar të mbrohet mendja juaj. Ky dokument shpjegon se si do të marrim, të përdorim dhe të ruajmë informacionin tuaj personal.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">2. Informacioni që Ne Mbledhim</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Ne mbledhim informacionin si:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>Emri dhe adresa juaj email</li>
              <li>Numri i telefonit tuaj</li>
              <li>Informacioni mbi kompaninë tuaj</li>
              <li>Të dhënat e navigimit në website</li>
              <li>Preferencat e shërbimit</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">3. Si e Përdorim Informacionin Tuaj</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Informacioni juaj përdoret për:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Ofrimin e shërbimeve tona</li>
              <li>Komunikimin me ju për përditësimet dhe oferta</li>
              <li>Përmirësimin e website-it tonë</li>
              <li>Analizimin e të dhënave për statistika</li>
              <li>Respektimin e detyrimeve ligjore</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">4. Siguria e Të Dhënave</h2>
            <p className="text-gray-400 leading-relaxed">
              Ne përdorim enkriptimin SSL dhe masat e tjera të sigurimit për të mbrojtur informacionin tuaj përsonal. Megjithatë, asnjë metod transmetimi përmes Internetit nuk është 100% i sigurt.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">5. Të Drejtat Tuaja</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Ju keni të drejtën për të:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Qasur të dhënat tuaja personale</li>
              <li>Kërkuar një kopje të të dhënave</li>
              <li>Kërkuar ndryshime ose fshirjen e të dhënave</li>
              <li>Kundërshtuar përpunimin e të dhënave</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">6. Kontakti</h2>
            <p className="text-gray-400 leading-relaxed">
              Nëse keni pyetje për këtë politikë, na kontaktoni në suport@vizualx.online ose në +355 69 69 69 348.
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
