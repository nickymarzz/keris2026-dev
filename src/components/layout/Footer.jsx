import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-maroon border-t border-gold/15 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <h3
              className="text-2xl font-800 text-gold mb-3"
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}
            >
              KERIS
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed font-times max-w-xs">
              Kelantan Education Resource Initiative for Students.
              Empowering the next generation of leaders.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="https://www.instagram.com/kerismy/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-cream/30 hover:text-gold transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/keris-my" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-cream/30 hover:text-gold transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4
              className="text-gold text-xs font-700 tracking-widest uppercase mb-4"
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
            >
              Navigate
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/news', label: 'News & Announcements' },
                { to: '/scholars', label: 'Scholars Directory' },
                { to: '/scholarships', label: 'Scholarships Hub' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-cream/45 hover:text-gold text-sm transition-colors font-times">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Admin */}
          <div>
            <h4
              className="text-gold text-xs font-700 tracking-widest uppercase mb-4"
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
            >
              Resources & Admin
            </h4>
            <ul className="space-y-2">
              <li><Link to="/resume" className="text-cream/45 hover:text-gold text-sm transition-colors font-times">Resume Template</Link></li>
              <li><Link to="/essay"  className="text-cream/45 hover:text-gold text-sm transition-colors font-times">Essay Repository</Link></li>
              <li className="pt-2">
                <Link to="/admin" className="text-gold/70 hover:text-gold text-xs font-spartan uppercase tracking-wider transition-colors inline-flex items-center gap-1.5">
                  <span>⚙</span> Admin Portal →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="keris-divider mt-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-cream/25 text-xs font-times">
          <p>© {currentYear} KERIS. All rights reserved.</p>
          <p>For scholars, By scholars</p>
        </div>
      </div>
    </footer>
  )
}
