import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ scholars: 0, scholarships: 0, milestones: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('scholars').select('id', { count: 'exact', head: true }),
      supabase.from('scholarships').select('id', { count: 'exact', head: true }),
      supabase.from('history_entries').select('id', { count: 'exact', head: true }),
    ]).then(([s, sh, h]) => {
      setStats({
        scholars:     s.count  || 0,
        scholarships: sh.count || 0,
        milestones:   h?.count || 0,
      })
    })
  }, [])

  const tiles = [
    { label: 'Scholars',     value: stats.scholars,     to: '/admin/scholars',     icon: '👤', color: 'border-gold/40' },
    { label: 'Scholarships', value: stats.scholarships, to: '/admin/scholarships', icon: '📋', color: 'border-crimson/40' },
    { label: 'Committee',    value: null,               to: '/admin/committee',    icon: '🏛️', color: 'border-wine/40' },
    { label: 'News & Events', value: null,              to: '/admin/news',         icon: '📰', color: 'border-gold/40' },
    { label: 'Milestones',   value: stats.milestones,   to: '/admin/history',      icon: '⏳', color: 'border-gold/40' },
  ]

  return (
    <div className="page-enter pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-gold/60 text-xs font-700 tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
            Admin Panel
          </p>
          <h1 className="text-4xl font-900 text-cream" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>
            Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {tiles.map(({ label, value, to, icon, color }) => (
            <div key={label} className={`glass-card p-6 border-t-2 ${color}`} style={{ borderRadius: 0 }}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-3xl font-900 text-cream mb-1" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>{value}</div>
              <div className="text-cream/40 text-xs font-spartan uppercase tracking-widest" style={{ fontFamily: "'League Spartan', sans-serif" }}>{label}</div>
              {to && (
                <Link to={to} className="mt-3 block text-xs text-gold/50 hover:text-gold transition-colors font-spartan uppercase" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Manage →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Quick links */}
        <h2 className="text-xl font-700 text-cream mb-5" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { to: '/admin/scholars',     label: 'Edit Scholars',     desc: 'Add, remove, or update scholar profiles and details.' },
            { to: '/admin/scholarships', label: 'Edit Scholarships', desc: 'Update scholarship listings, status, and application links.' },
            { to: '/admin/committee',    label: 'Edit Committee',    desc: 'Manage committee members, departments, and photos.' },
            { to: '/admin/news',        label: 'Edit News & Events', desc: 'Post announcements, event recaps, and community updates.' },
            { to: '/admin/history',     label: 'Edit Milestones & History', desc: 'Update timeline entries and key organizational milestones.' },
          ].map(({ to, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="glass-card p-6 card-glow flex items-center justify-between group"
              style={{ borderRadius: 0 }}
            >
              <div>
                <h3 className="text-base font-700 text-cream group-hover:text-gold transition-colors mb-1" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
                  {label}
                </h3>
                <p className="text-cream/40 text-sm font-times">{desc}</p>
              </div>
              <span className="text-gold/30 group-hover:text-gold transition-colors text-xl">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
