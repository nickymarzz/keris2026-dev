import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts'

const IMPACT_DATA = [
  { name: 'Instagram',          value: 53.2 },
  { name: 'Telegram',           value: 25.4 },
  { name: 'TikTok',             value: 16.0 },
  { name: 'Linktree & Website', value: 4.6  },
]
// Match original: crimson, gray, dark-gray, gold
const CHART_COLORS = ['#8B1020', '#9CA3AF', '#4B5563', '#E6A122']

const SCHOLARSHIP_DATA = [
  { name: 'PETRONAS', scholars: 32 },
  { name: 'JPA',      scholars: 22 },
  { name: 'YTM-MARA', scholars: 22 },
  { name: 'PNB',      scholars: 13 },
  { name: 'YTN',      scholars: 10 },
  { name: 'YK',       scholars: 8  },
  { name: 'TAZU UTP', scholars: 5  },
  { name: 'MNNB',     scholars: 3  },
  { name: 'STAR',     scholars: 3  },
  { name: 'MYPAC',    scholars: 2  },
]

const FLAGSHIP_PIE_DATA = [
  { name: 'Stadium',     value: 60 },
  { name: 'Google Meet', value: 40 },
]

const MOCK_INTERVIEW_DATA = [
  { year: '2023', participants: 103 },
  { year: '2024', participants: 180 },
  { year: '2025', participants: 222 },
]

const SOCIAL_MEDIA_DATA = [
  { platform: 'Instagram', '2024': 800,  '2025': 1744 },
  { platform: 'Telegram',  '2024': 600,  '2025': 1716 },
]

const RESOURCES_DATA = [
  { name: 'Telegram Updates',  value: 48 },
  { name: 'Scholarship Status', value: 24 },
  { name: 'Scholar Dashboard', value: 20 },
  { name: 'Essay Repository',  value: 16 },
  { name: 'Resume Template',   value: 13 },
]

const RESOURCES_COLORS = ['#E6A122', '#8B1020', '#9CA3AF', '#4B5563', '#C4820A']
const FLAGSHIP_COLORS  = ['#8B1020', '#E6A122']

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1a0000', border: '1px solid rgba(230,161,34,0.2)', borderRadius: 0, fontSize: 12 },
  labelStyle: { color: '#E6A122' },
  itemStyle: { color: '#FDF6E3' },
}

const DEPARTMENTS = [
  'Secretarial & Finance',
  'Programmes & PR',
  'Content & Resources',
  'Publicity & Design',
  'Technical',
]

const RADIAN = Math.PI / 180
function PieLabel({ cx, cy, midAngle, outerRadius, name, value }) {
  const radius = outerRadius + 38
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const anchor = x > cx ? 'start' : 'end'
  return (
    <text
      x={x} y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontSize={11}
      fontFamily="'Times New Roman', serif"
      fill="rgba(253,246,227,0.80)"
    >
      <tspan x={x} dy="-7">{name}</tspan>
      <tspan x={x} dy="15" fill="#E6A122" fontWeight="700">{value}%</tspan>
    </text>
  )
}


export default function Landing() {
  const [committee, setCommittee] = useState([])
  const [activeDept, setActiveDept] = useState(DEPARTMENTS[0])

  useEffect(() => {
    supabase.from('committee').select('*').order('created_at', { ascending: true })
      .then(({ data }) => data && setCommittee(data))
  }, [])

const directors = useMemo(() => {
    const dirs = committee.filter(m => m.department === 'Directors')
    // Put the Managing Director in the center slot (index 1)
    if (dirs.length === 3) {
      const idx = dirs.findIndex(d => d.role?.toLowerCase().includes('managing'))
      if (idx !== -1 && idx !== 1) {
        const arr = [...dirs]
        const [managing] = arr.splice(idx, 1)
        arr.splice(1, 0, managing)
        return arr
      }
    }
    return dirs
  }, [committee])

  const deptMap = useMemo(() =>
    DEPARTMENTS.reduce((acc, d) => {
      acc[d] = committee
        .filter(m => m.department === d)
        .sort((a, b) => (b.is_head ? 1 : 0) - (a.is_head ? 1 : 0))
      return acc
    }, {}),
    [committee]
  )

  const activeDeptMembers = deptMap[activeDept] ?? []

return (
    <div className="page-enter">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          {/* ↓ Place your image in src/assets/ and update the path below */}
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Kicker */}
          <p
            className="text-gold/70 text-xs font-700 tracking-[0.3em] uppercase mb-6 animate-fade-up"
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
          >
              Kelantan Education Resource Initiative for Students
          </p>

          {/* Main heading */}
          <h1
            className="text-gold-shimmer text-6xl md:text-8xl font-900 leading-none tracking-tight mb-6 animate-fade-up animate-fade-up-delay-1"
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
          >
            KERIS
          </h1>

          <p
            className="text-cream/70 text-lg md:text-xl font-times leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up animate-fade-up-delay-2"
          >
            Uniting Malaysian scholars across the world. Empowering students to pursue
            excellence, navigate scholarships, and build a legacy.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-fade-up animate-fade-up-delay-3">
            <Link to="/scholars" className="btn-primary">
              Meet Our Scholars
            </Link>
            <Link to="/scholarships" className="btn-outline">
              Explore Scholarships
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
          <span className="text-xs text-gold font-spartan tracking-widest" style={{ fontFamily: "'League Spartan', sans-serif" }}>SCROLL</span>
          <div className="w-px h-8 bg-gold" />
        </div>
      </section>


      {/* ─── ABOUT / IMPACT / COMMITTEE — shared background ─── */}
      <div className="bg-gradient-to-b from-wine/30 via-wine/20 to-wine/30">

      {/* ─── ABOUT KERIS ─── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
        <div className="keris-divider">
          <span
            className="text-gold text-xs font-700 tracking-[0.3em] uppercase"
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
          >
            About Us
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mt-12">
          <div>
            <h2
              className="text-4xl md:text-5xl font-800 text-cream leading-tight mb-6"
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}
            >
              What is <span className="text-gold">KERIS</span>?
            </h2>
            <div className="space-y-4 text-cream/65 font-times text-base leading-relaxed">
              <p>
                KERIS — <em>Kelantan Education Resource Initiative for Students</em> —  is an illustrious and visionary student-led organization that ardently endeavors to empower and uplift the aspiring scholars of Kelantan in their formidable academic odyssey post-SPM. With an unwavering commitment, we extend a benevolent hand to guide and nurture these bright minds, facilitating their quest for erudition and scholarly pursuits. Through our tenacious efforts, we proffer invaluable aid, orchestrating a myriad of opportunities, including the procurement of prestigious scholarships, as well as elucidating a lucid trajectory, enabling them to embark upon their educational endeavors with unwavering confidence and clarity.
              </p>
              <p>
                We firmly believe that everyone deserves equal opportunity and support to pursue scholarship applications, regardless of their upbringing.
              </p>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center items-center">
            <img
              src="/reallogo.png"
              alt="KERIS Logo"
              className="w-96 md:w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
        </div>
      </section>

      {/* ─── IMPACT REPORT ─── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="keris-divider mb-4">
            <span
              className="text-gold text-xs font-700 tracking-[0.3em] uppercase"
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
            >
              Impact Report
            </span>
          </div>

          {/* Row 1: existing reach pie + scholarship bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Reach Pie */}
            <div className="glass-card p-8" style={{ borderRadius: 0 }}>
              <h3 className="text-base font-800 text-cream mb-1 uppercase tracking-widest text-center" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}>
                Impact Number
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={IMPACT_DATA} cx="50%" cy="50%" outerRadius={100} dataKey="value" labelLine={{ stroke: 'rgba(253,246,227,0.3)', strokeWidth: 1 }} label={PieLabel}>
                    {IMPACT_DATA.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="text-xl font-800 text-cream" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}>Total Impacted</p>
                <p className="text-3xl font-900 text-gold" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>159,876 Students</p>
              </div>
            </div>

            {/* Scholarship Success Bar */}
            <div className="glass-card p-8" style={{ borderRadius: 0 }}>
              <h3 className="text-base font-800 text-cream mb-1 uppercase tracking-widest text-center" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}>
                Scholarship Success
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={SCHOLARSHIP_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(253,246,227,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(253,246,227,0.55)', fontSize: 10, fontFamily: 'Times New Roman' }} angle={-40} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: 'rgba(253,246,227,0.4)', fontSize: 10 }} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Bar dataKey="scholars" fill="#8B1020" radius={[2, 2, 0, 0]}>
                    {SCHOLARSHIP_DATA.map((_, i) => <Cell key={i} fill={i === 0 ? '#E6A122' : '#8B1020'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="border-t border-gold/15 pt-4 mt-2 space-y-2">
                <p className="text-cream/70 font-times text-xs leading-relaxed">
                  <span className="text-gold font-700" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>2024:</span> 70% from 239 students voted YES — 167 new scholars.
                </p>
                <p className="text-cream/70 font-times text-xs leading-relaxed">
                  <span className="text-gold font-700" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>2025:</span> 52% from 616 students voted YES.
                </p>
                <p className="text-gold font-900 text-lg text-center pt-1" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>319 NEW SCHOLARS!</p>
              </div>
            </div>
          </div>

          {/* Row 2: flagship event + social media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Flagship Event */}
            <div className="glass-card p-8" style={{ borderRadius: 0 }}>
              <h3 className="text-base font-800 text-cream mb-6 uppercase tracking-widest text-center" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}>
                Flagship Event
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gold/60 text-xs font-times text-center mb-2">Series 1: Scholarship Sharing</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={FLAGSHIP_PIE_DATA} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                        {FLAGSHIP_PIE_DATA.map((_, i) => <Cell key={i} fill={FLAGSHIP_COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} {...TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-3 mt-1">
                    {FLAGSHIP_PIE_DATA.map((d, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: FLAGSHIP_COLORS[i] }} />
                        <span className="text-cream/50 text-xs font-times">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gold/60 text-xs font-times text-center mb-2">Series 2,3: Mock Interview</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={[{ name: 'S2', value: 850 }, { name: 'S3', value: 820 }]} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(253,246,227,0.06)" />
                      <XAxis dataKey="name" tick={{ fill: 'rgba(253,246,227,0.5)', fontSize: 10 }} />
                      <YAxis tick={{ fill: 'rgba(253,246,227,0.4)', fontSize: 10 }} />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Bar dataKey="value" fill="#8B1020" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="border-t border-gold/15 pt-4">
                <p className="text-cream/70 font-times text-xs text-center mb-3">Mock Interview Participants</p>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={MOCK_INTERVIEW_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(253,246,227,0.06)" />
                    <XAxis dataKey="year" tick={{ fill: 'rgba(253,246,227,0.5)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'rgba(253,246,227,0.4)', fontSize: 10 }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Line type="monotone" dataKey="participants" stroke="#E6A122" strokeWidth={2} dot={{ fill: '#E6A122', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-around mt-2">
                  {MOCK_INTERVIEW_DATA.map(d => (
                    <div key={d.year} className="text-center">
                      <p className="text-gold font-900 text-lg" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>{d.participants}{d.year === '2025' ? '!!' : ''}</p>
                      <p className="text-cream/50 text-xs font-times">{d.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media + Resources */}
            <div className="glass-card p-8" style={{ borderRadius: 0 }}>
              <h3 className="text-base font-800 text-cream mb-6 uppercase tracking-widest text-center" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}>
                Social Media Growth
              </h3>
              <div className="flex justify-center gap-4 mb-2">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8B1020]" /><span className="text-cream/50 text-xs font-times">2024</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#E6A122]" /><span className="text-cream/50 text-xs font-times">2025</span></div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={SOCIAL_MEDIA_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(253,246,227,0.06)" />
                  <XAxis dataKey="platform" tick={{ fill: 'rgba(253,246,227,0.55)', fontSize: 11, fontFamily: 'Times New Roman' }} />
                  <YAxis tick={{ fill: 'rgba(253,246,227,0.4)', fontSize: 10 }} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Bar dataKey="2024" fill="#8B1020" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="2025" fill="#E6A122" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-around mb-6 mt-1">
                <p className="text-gold/70 font-times text-xs">Instagram <span className="text-gold font-700" style={{ fontFamily: "'League Spartan', sans-serif" }}>+118%!</span></p>
                <p className="text-gold/70 font-times text-xs">Telegram <span className="text-gold font-700" style={{ fontFamily: "'League Spartan', sans-serif" }}>+186%!</span></p>
              </div>

              <div className="border-t border-gold/15 pt-4">
                <p className="text-cream/70 font-times text-xs text-center mb-3">Most Beneficial Resources</p>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={140}>
                    <PieChart>
                      <Pie data={RESOURCES_DATA} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                        {RESOURCES_DATA.map((_, i) => <Cell key={i} fill={RESOURCES_COLORS[i]} />)}
                      </Pie>
                      <Tooltip {...TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1">
                    {RESOURCES_DATA.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: RESOURCES_COLORS[i] }} />
                        <span className="text-cream/60 font-times text-xs">{d.name}</span>
                        <span className="text-gold text-xs font-700 ml-auto" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMMITTEE ─── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
        <div className="keris-divider mb-12">
          <span className="text-gold text-xs font-700 tracking-[0.3em] uppercase" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
            Committee
          </span>
        </div>
        <h2 className="text-4xl font-800 text-cream text-center mb-14" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}>
          Meet the <span className="text-gold">Team</span>
        </h2>

        {/* Directors */}
        <div className="mb-16">
          <p className="text-gold/50 text-xs font-700 tracking-[0.25em] uppercase text-center mb-8" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
            Directors
          </p>
          {directors.length === 0 ? (
            <p className="text-center text-cream/30 font-times text-sm">No directors added yet.</p>
          ) : (
            (() => {
              const managing = directors.find(d => d.role?.toLowerCase().includes('managing'))
              const coDirectors = directors.filter(d => !d.role?.toLowerCase().includes('managing'))
              const DirCard = ({ member, size = 'sm', isManaging = false }) => (
                <div className={`group text-center cursor-pointer select-none ${size === 'lg' ? 'w-56' : 'w-48'}`}>
                  <div className={`relative mx-auto mb-3 overflow-visible ${size === 'lg' ? 'w-56 h-56' : 'w-48 h-48'}`}>
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className={`w-full h-full object-contain ${
                          isManaging ? 'managing-director-cutout-glow' : 'director-cutout-glow'
                        }`}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        isManaging ? 'managing-director-cutout-glow' : 'director-cutout-glow'
                      }`}>
                        <span className="text-gold/50 text-3xl" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}>
                          {member.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-maroon to-transparent pointer-events-none" />
                  </div>
                  <h4
                    className="text-base font-700 text-cream leading-tight group-hover:text-gold transition-colors duration-200"
                    style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
                  >
                    {member.name}
                  </h4>
                  <p className="text-gold/80 text-xs font-times mt-1 group-hover:text-gold transition-colors duration-200">
                    {member.role}
                  </p>
                </div>
              )
              return (
                <div className="flex flex-col items-center">
                  {managing && (
                    <div className="flex justify-center mb-4">
                      <div className="-translate-y-4">
                        <DirCard member={managing} size="lg" isManaging={true} />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-center items-end gap-8 md:gap-12 flex-wrap">
                    {coDirectors.map(d => <DirCard key={d.id} member={d} size="sm" isManaging={false} />)}
                  </div>
                </div>
              )
            })()
          )}
        </div>

        {/* Department tabs + swipeable members */}
        <div>
          <p className="text-gold/50 text-xs font-700 tracking-[0.25em] uppercase text-center mb-6" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
            Departments
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {DEPARTMENTS.map(d => (
              <button
                key={d}
                onClick={() => setActiveDept(d)}
                className={`px-4 py-2 text-xs font-700 uppercase tracking-wider transition-all duration-200 border ${
                  activeDept === d
                    ? 'bg-gold text-maroon border-gold shadow-[0_0_15px_rgba(230,161,34,0.3)]'
                    : 'bg-transparent text-cream/50 border-gold/20 hover:border-gold/40 hover:text-cream/80'
                }`}
                style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700, borderRadius: 0 }}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Department pyramid layout */}
          {activeDeptMembers.length === 0 ? (
            <p className="text-center text-cream/30 font-times text-sm">No members added yet.</p>
          ) : (() => {
            const head = activeDeptMembers.find(m => m.is_head) ||
                         activeDeptMembers.find(m => {
                           const r = (m.role || '').toLowerCase()
                           return r.includes('head') || r.includes('lead') || r.includes('director') || r.includes('chief')
                         })
            const members = activeDeptMembers.filter(m => m.id !== head?.id)

            const MemberCard = ({ member, size = 'sm' }) => (
              <div className={`group text-center cursor-pointer select-none ${size === 'lg' ? 'w-52' : 'w-44'}`}>
                <div className={`relative mx-auto mb-3 overflow-visible ${size === 'lg' ? 'w-52 h-52' : 'w-44 h-44'}`}>
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full object-contain member-cutout-glow"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center member-cutout-glow">
                      <span className="text-gold/50 text-2xl" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}>
                        {member.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-maroon to-transparent pointer-events-none" />
                </div>
                <h4
                  className="text-sm font-700 text-cream leading-tight group-hover:text-gold transition-colors duration-200"
                  style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
                >
                  {member.name}
                </h4>
                <p className="text-gold/70 text-xs font-times mt-1 group-hover:text-gold transition-colors duration-200">
                  {member.role}
                </p>
              </div>
            )
            return (
              <div className="flex flex-col items-center">
                {/* Head — centered, elevated tier */}
                {head && (
                  <div className="flex justify-center mb-3">
                    <div className="-translate-y-4">
                      <MemberCard member={head} size="lg" />
                    </div>
                  </div>
                )}
                {/* Committee members tier below */}
                {members.length > 0 && (
                  <div className="flex justify-center items-end gap-8 md:gap-10 flex-wrap max-w-5xl">
                    {members.map(m => <MemberCard key={m.id} member={m} size="sm" />)}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
        </div>
      </section>
      </div>{/* end shared background */}

      {/* ─── CTA ─── */}
      <section className="bg-hero-gradient py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2
            className="text-4xl font-800 text-cream mb-4"
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}
          >
            Ready to find your <span className="text-gold">scholarship</span>?
          </h2>
          <p className="text-cream/60 font-times mb-8">
            Browse dozens of scholarships filtered for Malaysian students.
          </p>
          <Link to="/scholarships" className="btn-primary text-sm">
            Browse Scholarships →
          </Link>
        </div>
      </section>
    </div>
  )
}
