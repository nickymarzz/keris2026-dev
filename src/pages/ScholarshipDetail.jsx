import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const STATUS_CLASSES = { open: 'badge-open', closed: 'badge-closed', soon: 'badge-soon' }

function getStatusInfo(status) {
  const s = (status || '').toLowerCase().trim()
  if (s === 'open') return { label: 'Open', className: 'badge-open' }
  if (s === 'soon' || s === 'upcoming' || s === 'opening soon') return { label: 'Opening Soon', className: 'badge-soon' }
  return { label: 'Closed', className: 'badge-closed' }
}

export default function ScholarshipDetail() {
  const { id } = useParams()
  const [scholarship, setScholarship] = useState(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setScholarship(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!scholarship) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-cream/40 font-times text-lg">Scholarship not found.</p>
      <Link to="/scholarships" className="text-gold/60 hover:text-gold font-spartan uppercase text-xs tracking-widest transition-colors" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        ← Back to Scholarships
      </Link>
    </div>
  )

  const { label: statusLabel, className: statusClass } = getStatusInfo(scholarship.status)

  return (
    <div className="page-enter min-h-screen pb-20 bg-gradient-to-b from-wine/30 via-wine/20 to-wine/30">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden flex items-end">
        {/* Background */}
        {scholarship.logo_url ? (
          <>
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${scholarship.logo_url})` }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(30,4,4,0.25) 0%, rgba(30,4,4,0.78) 100%)' }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(60,8,8,0.7), rgba(30,4,4,0.9))' }} />
        )}

        {/* Back link */}
        <div className="absolute top-0 left-0 pt-20 px-6 md:px-10 z-20">
          <Link
            to="/scholarships"
            className="text-cream/40 hover:text-gold text-xs font-spartan uppercase tracking-widest transition-colors"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            ← Scholarships
          </Link>
        </div>

        {/* Name & status */}
        <div className="relative z-10 px-6 md:px-10 pb-8 w-full">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
              {scholarship.is_bumiputera && (
                <span className="status-badge bg-gold/15 text-gold border border-gold/30">
                  Bumiputera
                </span>
              )}
              {scholarship.is_anak_negeri && (
                <span className="status-badge bg-crimson/25 text-cream border border-crimson/40">
                  Anak Negeri Kelantan
                </span>
              )}
            </div>
            <h1
              className="text-3xl md:text-5xl font-900 text-cream leading-tight"
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
            >
              {scholarship.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 pt-10 space-y-10">

        {/* Quick facts */}
        <div className="divide-y divide-gold/10 border-t border-gold/10">
          {scholarship.country && <Fact label="Location" value={scholarship.country} />}
          {scholarship.study_duration && <Fact label="Duration" value={scholarship.study_duration} />}
          {scholarship.min_result && <Fact label="Min. Result" value={scholarship.min_result} />}
          {scholarship.is_bumiputera && <Fact label="Eligibility" value="Bumiputera Candidates" />}
          {scholarship.is_anak_negeri && <Fact label="State Quota" value="Anak Negeri Kelantan" />}
        </div>

        {/* Income group — subtle note */}
        {scholarship.income_group && (
          <p className="text-cream/35 font-times text-sm">
            Income group: <span className="text-cream/55">{scholarship.income_group}</span>
          </p>
        )}

        {/* About */}
        {scholarship.about && (
          <Section label="About">
            <p className="text-cream/70 font-times text-base leading-relaxed">{scholarship.about}</p>
          </Section>
        )}

        {/* Eligibility */}
        {scholarship.extra_details && (
          <Section label="Eligibility">
            <p className="text-cream/70 font-times text-base leading-relaxed">{scholarship.extra_details}</p>
          </Section>
        )}

        {/* Courses offered */}
        {Array.isArray(scholarship.courses_offered) && scholarship.courses_offered.length > 0 && (
          <Section label={`Courses Offered (${scholarship.courses_offered.length})`}>
            <div className="flex flex-wrap gap-2">
              {scholarship.courses_offered.map(c => (
                <span
                  key={c}
                  className="text-sm bg-gold/10 text-gold/80 px-3 py-1 border border-gold/20 font-spartan"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Apply */}
        {scholarship.application_url && (
          <div className="pt-2">
            {scholarship.status !== 'closed' ? (
              <a
                href={scholarship.application_url.startsWith('http') ? scholarship.application_url : `https://${scholarship.application_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block text-base px-8 py-3"
              >
                Apply Now →
              </a>
            ) : (
              <div className="inline-block border border-white/10 text-cream/30 text-sm font-times px-8 py-3">
                Applications are currently closed
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div>
      <p
        className="text-xs text-gold/50 font-spartan uppercase tracking-widest mb-3"
        style={{ fontFamily: "'League Spartan', sans-serif" }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}

function Fact({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <p className="text-xs text-gold/40 font-spartan uppercase tracking-widest shrink-0" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        {label}
      </p>
      <p className="text-cream/75 font-times text-sm text-right">{value}</p>
    </div>
  )
}
