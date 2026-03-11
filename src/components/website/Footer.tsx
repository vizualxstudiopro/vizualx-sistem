import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0c10] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              VIZUAL<span className="text-[#cfa861]">X</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Transformo idetë në vepra digjitale mahnitëse. Dizajn web premium, branding dhe zgjidhje digjitale.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigim</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#cfa861] transition-colors text-sm">
                  Ballina
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-gray-400 hover:text-[#cfa861] transition-colors text-sm">
                  Shërbimet
                </Link>
              </li>
              <li>
                <Link href="/#portfolio" className="text-gray-400 hover:text-[#cfa861] transition-colors text-sm">
                  Portofoli
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-[#cfa861] transition-colors text-sm">
                  Kontakti
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shërbime</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">Zhvillim Web</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Branding</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Media Shoqeruese</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Zgjidhje ERP</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Email: info@vizualx.com</li>
              <li className="text-gray-400">Phone: +355 (0) XXX XXX XXX</li>
              <li className="text-gray-400">Tirana, Albania</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} VizualX. Të gjitha të drejtat e rezervuara.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-[#cfa861] transition-colors text-sm">
                Politika e Privatësisë
              </a>
              <a href="#" className="text-gray-500 hover:text-[#cfa861] transition-colors text-sm">
                Kushtet e Shërbimit
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
