import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function AdminGate({ children }) {
  const {
    user,
    profile,
    loading: authLoading,
    signInWithPasscode,
    signInWithPassword,
    signOut,
    isAdmin,
  } = useAuthStore()

  const [tab, setTab] = useState('passcode') // 'passcode' | 'email'
  
  // Passcode state
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState('')

  // Supabase Auth state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')

  // If initial auth check is in flight
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Verified admin
  if (isAdmin()) return children

  // Logged-in user who is NOT an admin
  if (user && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="glass-card p-8 md:p-10 w-full max-w-md text-center" style={{ borderRadius: 0, borderTop: '3px solid #840E20' }}>
          <div className="text-3xl mb-3">🔒</div>
          <h1
            className="text-2xl font-900 text-cream mb-2"
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
          >
            Access Denied
          </h1>
          <p className="text-cream/70 font-times text-sm mb-6 leading-relaxed">
            Signed in as <strong className="text-gold">{user.email}</strong>, but your account does not have administrator privileges in <code className="text-cream/90 bg-maroon/60 px-1.5 py-0.5 border border-gold/20">public.users</code> (role: <span className="text-gold">{profile?.role || 'user'}</span>).
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={signOut} className="btn-primary justify-center">
              Sign Out / Switch Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handlePasscodeSubmit = (e) => {
    e.preventDefault()
    setPasscodeError('')
    const ok = signInWithPasscode(passcode)
    if (!ok) {
      setPasscodeError('Incorrect passcode. Check your VITE_ADMIN_PASSWORD in .env.')
      setPasscode('')
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setEmailError('')
    setLoading(true)
    try {
      await signInWithPassword(email, password)
    } catch (err) {
      setEmailError(err.message || 'Failed to sign in. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="glass-card p-8 md:p-10 w-full max-w-md" style={{ borderRadius: 0, borderTop: '3px solid #E6A122' }}>
        <div className="flex items-center justify-between mb-2">
          <h1
            className="text-2xl font-900 text-cream"
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
          >
            Admin Portal
          </h1>
          <span className="text-gold text-xs font-spartan uppercase tracking-widest px-2 py-0.5 border border-gold/30">
            Protected
          </span>
        </div>
        <p className="text-cream/50 font-times text-sm mb-6">
          Access restricted to KERIS administrators verified in public.users.
        </p>

        {/* Tab switchers */}
        <div className="flex border-b border-cream/10 mb-6">
          <button
            type="button"
            onClick={() => { setTab('passcode'); setPasscodeError(''); setEmailError('') }}
            className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-spartan transition-colors ${
              tab === 'passcode'
                ? 'text-gold border-b-2 border-gold font-700'
                : 'text-cream/50 hover:text-cream font-500'
            }`}
          >
            Passphrase
          </button>
          <button
            type="button"
            onClick={() => { setTab('email'); setPasscodeError(''); setEmailError('') }}
            className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-spartan transition-colors ${
              tab === 'email'
                ? 'text-gold border-b-2 border-gold font-700'
                : 'text-cream/50 hover:text-cream font-500'
            }`}
          >
            Supabase Account
          </button>
        </div>

        {tab === 'passcode' ? (
          <form onSubmit={handlePasscodeSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-cream/40 text-xs font-spartan uppercase tracking-wider mb-1.5">
                Admin Passphrase
              </label>
              <input
                type="password"
                value={passcode}
                onChange={e => { setPasscode(e.target.value); setPasscodeError('') }}
                placeholder="Configured in .env"
                autoFocus
                className="keris-input"
              />
            </div>
            {passcodeError && (
              <p className="text-red-400 text-xs font-times -mt-1">{passcodeError}</p>
            )}
            <button type="submit" className="btn-primary justify-center mt-2">
              Unlock Dashboard
            </button>
            <p className="text-cream/30 text-xs font-times text-center mt-2">
              Set in your <code className="text-gold/70">.env</code> as <code className="text-gold/70">VITE_ADMIN_PASSWORD</code>
            </p>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-cream/40 text-xs font-spartan uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError('') }}
                placeholder="admin@example.com"
                required
                autoFocus
                className="keris-input"
              />
            </div>
            <div>
              <label className="block text-cream/40 text-xs font-spartan uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setEmailError('') }}
                placeholder="••••••••"
                required
                className="keris-input"
              />
            </div>
            {emailError && (
              <p className="text-red-400 text-xs font-times -mt-1">{emailError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center mt-2 disabled:opacity-50"
            >
              {loading ? 'Verifying role…' : 'Sign In with Supabase'}
            </button>
            <p className="text-cream/30 text-xs font-times text-center mt-2">
              Verifies <code className="text-gold/70">role = 'admin'</code> from the <code className="text-gold/70">public.users</code> table.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
