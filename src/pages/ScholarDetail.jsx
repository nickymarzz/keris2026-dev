import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ScholarDetail() {
  const { id } = useParams()
  const [scholar, setScholar] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('scholars')
      .select('*, scholarships(name)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setScholar({ ...data, scholarship_name: data.scholarships?.name || '—' })
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!scholar) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-cream/40 font-times text-lg">Scholar not found.</p>
      <Link to="/scholars" className="text-gold/60 hover:text-gold font-spartan uppercase text-xs tracking-widest transition-colors" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        ← Back to Scholars
      </Link>
    </div>
  )

  const initials = scholar.name
    ?.split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('') || '?'

  return (
    <div className="page-enter min-h-screen pb-20 bg-gradient-to-b from-wine/30 via-wine/20 to-wine/30">
      {/* Hero */}
      <div className="relative h-80 md:h-[28rem] overflow-hidden flex items-end">
        {/* Blurred background photo */}
        {scholar.photo_url ? (
          <>
            <div
              className="absolute inset-0 bg-center bg-cover scale-110"
              style={{ backgroundImage: `url(${scholar.photo_url})`, filter: 'blur(20px)', opacity: 0.4 }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(30,4,4,0.2) 0%, rgba(30,4,4,0.78) 100%)' }} />
            {/* Portrait */}
            <div className="absolute inset-0 flex items-center justify-center pt-16 z-[1]">
              <div className="relative w-36 h-44 md:w-44 md:h-56 overflow-hidden border-2 border-gold/30 shadow-2xl">
                <img
                  src={scholar.photo_url}
                  alt={scholar.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(60,8,8,0.7), rgba(30,4,4,0.9))' }} />
            <div className="absolute inset-0 flex items-center justify-center pt-16 z-[1]">
              <div className="w-36 h-36 bg-wine/40 flex items-center justify-center border border-gold/20">
                <span
                  className="text-5xl font-800 text-gold/60"
                  style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}
                >
                  {initials}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Back link */}
        <div className="absolute top-0 left-0 pt-20 px-6 md:px-10 z-20">
          <Link
            to="/scholars"
            className="text-cream/40 hover:text-gold text-xs font-spartan uppercase tracking-widest transition-colors"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            ← Scholars
          </Link>
        </div>

        {/* Name & batch */}
        <div className="relative z-10 px-6 md:px-10 pb-8 w-full">
          <div className="max-w-4xl mx-auto">
            {scholar.spm_batch && (
              <div
                className="inline-block bg-gold text-maroon text-xs font-700 px-2 py-1 mb-2"
                style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
              >
                SPM {scholar.spm_batch}
              </div>
            )}
            <h1
              className="text-3xl md:text-5xl font-900 text-cream leading-tight"
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
            >
              {scholar.name}
            </h1>
            {scholar.current_university && (
              <p className="text-gold/70 font-times text-base mt-1">{scholar.current_university}</p>
            )}
            {scholar.scholarship_name && scholar.scholarship_name !== '—' && (
              <p className="text-cream/45 font-times text-sm mt-0.5">{scholar.scholarship_name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 pt-10 space-y-10">

        {/* Quick facts */}
        <div className="divide-y divide-gold/10 border-t border-gold/10">
          {scholar.current_university && <Fact label="University" value={scholar.current_university} />}
          {scholar.course && <Fact label="Course" value={scholar.course} />}
          {scholar.scholarship_name && scholar.scholarship_name !== '—' && (
            <Fact label="Scholarship" value={scholar.scholarship_name} />
          )}
          {scholar.batch && <Fact label="KERIS Batch" value={`Batch ${scholar.batch}`} />}
          {scholar.spm_batch && <Fact label="SPM Batch" value={String(scholar.spm_batch)} />}
          {scholar.past_school && <Fact label="Past School" value={scholar.past_school} />}
        </div>

        {/* Scholar Vlog / Journey Video */}
        {scholar.vlog_url && (
          <div className="p-6 bg-gradient-to-r from-maroon/60 via-wine/50 to-maroon/60 border border-gold/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gold font-spartan uppercase tracking-widest mb-1" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Scholar Journey & Vlog
                </p>
                <h3 className="text-xl font-800 text-cream" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}>
                  Watch {scholar.name?.split(' ')[0]}'s Experience
                </h3>
                <p className="text-cream/50 font-times text-sm mt-0.5">
                  Discover firsthand tips, university preparation, and campus life.
                </p>
              </div>
              <a
                href={scholar.vlog_url.startsWith('http') ? scholar.vlog_url : `https://${scholar.vlog_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 shrink-0 self-start sm:self-center"
              >
                <span>▶</span> Watch Vlog
              </a>
            </div>
          </div>
        )}

        {/* About / Bio */}
        {scholar.about && (
          <div>
            <p
              className="text-xs text-gold/50 font-spartan uppercase tracking-widest mb-3"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              About
            </p>
            <p className="text-cream/70 font-times text-base leading-relaxed">{scholar.about}</p>
          </div>
        )}

        {/* Contact */}
        {(scholar.instagram || scholar.contact_email) && (
          <div className="border-t border-gold/10 pt-8">
            <p className="text-xs text-gold/50 font-spartan uppercase tracking-widest mb-4" style={{ fontFamily: "'League Spartan', sans-serif" }}>
              Contact
            </p>
            <div className="flex flex-col gap-2">
              {scholar.instagram && (
                <p className="text-cream/60 font-times text-sm">
                  <span className="text-cream/30 mr-2">Instagram</span>
                  @{scholar.instagram}
                </p>
              )}
              {scholar.contact_email && (
                <p className="text-cream/60 font-times text-sm">
                  <span className="text-cream/30 mr-2">Email</span>
                  {scholar.contact_email}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
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
