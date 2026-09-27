import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/news', label: 'News' },
  { to: '/scholars', label: 'Scholars' },
  { to: '/scholarships', label: 'Scholarships' },
  { to: '/resume', label: 'Resume' },
  { to: '/essay', label: 'Essay' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isPasscodeAuthed, signOut, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const isAuthed = isAdmin()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-maroon/95 backdrop-blur-md border-b border-gold/20 shadow-lg'
        : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/logo.PNG" alt="KERIS logo" className="w-10 h-10 object-contain" />
          </div>
          <span
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800, fontSize: 30 }}
          >
            KERIS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 font-spartan text-sm font-600 tracking-wide uppercase transition-colors duration-200 ${isActive
                  ? 'text-gold'
                  : 'text-cream/70 hover:text-gold'
                }`
              }
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 600 }}
            >
              {label}
            </NavLink>
          ))}

          {/* Admin shortcut if authenticated */}
          {isAuthed && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `ml-2 px-3 py-1 text-xs border border-gold/40 text-gold uppercase tracking-widest font-spartan hover:bg-gold/10 transition-colors ${isActive ? 'bg-gold/20' : ''
                }`
              }
            >
              Admin Panel
            </NavLink>
          )}
        </div>

        {/* Auth status & actions */}
        {isAuthed && (
          <div className="hidden md:flex items-center gap-3">
            {user?.email && (
              <span className="text-cream/50 text-xs font-times">
                {user.email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="btn-outline text-xs py-1.5 px-3"
            >
              Sign out
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-gold transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gold transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gold transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-maroon/98 border-t border-gold/20 px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `py-2 font-spartan text-sm font-600 tracking-wide uppercase ${isActive ? 'text-gold' : 'text-cream/70'
                }`
              }
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              {label}
            </NavLink>
          ))}
          {isAuthed && (
            <div className="pt-2 mt-2 border-t border-cream/10 flex flex-col gap-2">
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="py-1.5 text-xs text-gold uppercase tracking-widest font-spartan"
              >
                Admin Panel →
              </NavLink>
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false) }}
                className="btn-outline w-full text-center text-xs py-2"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
