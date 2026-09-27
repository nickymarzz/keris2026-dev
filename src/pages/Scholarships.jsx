import { useEffect, useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { supabase } from '../lib/supabase'
import ScholarshipCard from '../components/ui/ScholarshipCard'

const GOLD    = '#E6A122'
const CRIMSON = '#840E20'
const WINE    = '#591D1F'
const CREAM   = '#FDF6E3'

const CHART_COLORS = [GOLD, CRIMSON, WINE, '#c8891c', '#a01528', '#3d1012']

function normalizeStatus(val) {
  if (!val) return ''
  const s = val.toLowerCase().trim()
  if (s === 'open') return 'open'
  if (s === 'soon' || s === 'upcoming' || s === 'opening soon') return 'soon'
  if (s === 'closed') return 'closed'
  return s
}

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading]           = useState(true)
  const [showCharts, setShowCharts]     = useState(false)
  /* Filters */
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('all')
  const [course,  setCourse]  = useState('all')
  const [quota,   setQuota]   = useState('all')

  useEffect(() => {
    supabase
      .from('scholarships')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setScholarships(data ?? [])
        setLoading(false)
      })
  }, [])

  const allCourses = useMemo(() => {
    const courses = new Set()
    scholarships.forEach(s => {
      if (Array.isArray(s.courses_offered)) {
        s.courses_offered.forEach(c => {
          if (c && typeof c === 'string') courses.add(c.trim())
        })
      }
    })
    return [...courses].sort()
  }, [scholarships])

  const filtered = useMemo(() => {
    return scholarships.filter(s => {
      // 1. Search term match (name, about, country, courses)
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchName = s.name?.toLowerCase().includes(q)
        const matchAbout = s.about?.toLowerCase().includes(q)
        const matchCountry = s.country?.toLowerCase().includes(q)
        const matchCourses = Array.isArray(s.courses_offered) && s.courses_offered.some(c => c?.toLowerCase().includes(q))
        if (!matchName && !matchAbout && !matchCountry && !matchCourses) return false
      }

      // 2. Status match (robust normalization)
      if (status !== 'all') {
        const normS = normalizeStatus(s.status)
        const normFilter = normalizeStatus(status)
        if (normS !== normFilter) return false
      }

      // 3. Course match
      if (course !== 'all') {
        if (!Array.isArray(s.courses_offered)) return false
        const hasCourse = s.courses_offered.some(c => c?.trim().toLowerCase() === course.trim().toLowerCase())
        if (!hasCourse) return false
      }

      // 4. Quota / Eligibility match
      if (quota === 'bumiputera' && !s.is_bumiputera) return false
      if (quota === 'anak_negeri' && !s.is_anak_negeri) return false

      return true
    })
  }, [scholarships, search, status, course, quota])

  /* Chart data */
  const statusData = useMemo(() => {
    const counts = scholarships.reduce((acc, s) => {
      const norm = normalizeStatus(s.status)
      const label = norm === 'open' ? 'Open' : norm === 'soon' ? 'Opening Soon' : 'Closed'
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [scholarships])

  const countryData = useMemo(() => {
    const counts = scholarships.reduce((acc, s) => {
      if (!s.country) return acc
      s.country.split(',').forEach(c => {
        const name = c.trim()
        if (name) acc[name] = (acc[name] || 0) + 1
      })
      return acc
    }, {})
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [scholarships])

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="glass-card px-3 py-2 text-xs font-times">
        <p className="text-gold">{label}</p>
        <p className="text-cream/80">{payload[0].value} scholarship{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    )
  }

  return (
    <div className="page-enter pt-24 pb-20 bg-gradient-to-b from-wine/30 via-wine/20 to-wine/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <p
          className="text-gold/60 text-xs font-700 tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
        >
          Opportunities
        </p>
        <h1
          className="text-5xl md:text-7xl font-900 text-cream leading-none mb-4"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
        >
          Find Your <span className="text-gold">Scholarship</span>
        </h1>
        <p className="text-cream/50 font-times text-lg max-w-xl leading-relaxed">
          Curated scholarships for Malaysian students, filtered for your background and ambition.
        </p>
      </div>

      {/* Filter bar */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="glass-card p-5" style={{ borderRadius: 0 }}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search scholarships…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="keris-input !pl-11"
              />
            </div>
            {/* Status */}
            <select value={status} onChange={e => setStatus(e.target.value)} className="keris-input md:w-36">
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="soon">Opening Soon</option>
              <option value="closed">Closed</option>
            </select>
            {/* Eligibility / Quota */}
            <select value={quota} onChange={e => setQuota(e.target.value)} className="keris-input md:w-44">
              <option value="all">All Eligibility</option>
              <option value="bumiputera">Bumiputera Only</option>
              <option value="anak_negeri">Anak Negeri Kelantan</option>
            </select>
            {/* Course */}
            <select value={course} onChange={e => setCourse(e.target.value)} className="keris-input md:w-48">
              <option value="all">All Courses</option>
              {allCourses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="text-xs text-gold/60 hover:text-gold transition-colors font-spartan uppercase tracking-wide"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              {showCharts ? '▲ Hide' : '▼ Show'} Analytics
            </button>
          </div>
        </div>

        {/* Active filters summary */}
        <p className="text-cream/25 text-xs font-times mt-2">
          {filtered.length} of {scholarships.length} scholarships
          {status !== 'all' && ` · ${status}`}
          {quota !== 'all' && ` · ${quota === 'bumiputera' ? 'Bumiputera' : 'Anak Negeri'}`}
          {course !== 'all' && ` · ${course}`}
        </p>
      </div>

      {/* Analytics Charts */}
      {showCharts && (
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6" style={{ borderRadius: 0 }}>
              <h3
                className="text-sm font-700 text-gold mb-5 uppercase tracking-widest"
                style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
              >
                Application Status
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#290101', border: '1px solid rgba(230,161,34,0.2)', borderRadius: 0, fontSize: 12 }}
                    labelStyle={{ color: GOLD }}
                    itemStyle={{ color: CREAM }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-6" style={{ borderRadius: 0 }}>
              <h3
                className="text-sm font-700 text-gold mb-5 uppercase tracking-widest"
                style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
              >
                By Country / Location
              </h3>
              <ResponsiveContainer width="100%" height={Math.max(200, countryData.length * 32)}>
                <BarChart data={countryData} layout="vertical" barSize={14} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                  <XAxis type="number" tick={{ fill: 'rgba(245,240,232,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'rgba(245,240,232,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230,161,34,0.05)' }} />
                  <Bar dataKey="value" fill={GOLD} radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Scholarship grid */}
      <div className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/30 font-times text-lg mb-4">No scholarships match your filters.</p>
            <button
              onClick={() => { setSearch(''); setStatus('all'); setCourse('all'); setQuota('all') }}
              className="text-gold/60 hover:text-gold text-sm font-spartan uppercase tracking-wide transition-colors"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(s => (
              <ScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
