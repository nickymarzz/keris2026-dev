import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ScholarCard({ scholar }) {
  const [imgError, setImgError] = useState(false)

  const initials = scholar.name
    ?.split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('') || '?'

  return (
    <Link
      to={`/scholars/${scholar.id}`}
      className="card-glow glass-card group overflow-hidden block"
      style={{ borderRadius: 0 }}
    >
      {/* Photo */}
      <div className="aspect-[3/4] relative overflow-hidden bg-wine/30">
        {scholar.photo_url && !imgError ? (
          <img
            src={scholar.photo_url}
            alt={scholar.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-4xl font-800 text-gold/60"
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800 }}
            >
              {initials}
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-transparent to-transparent" />

        {/* Vlog indicator */}
        {scholar.vlog_url && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm border border-gold/40 text-gold text-[10px] font-spartan px-2 py-0.5 tracking-wider uppercase flex items-center gap-1">
            <span>🎥</span> Vlog
          </div>
        )}

        {/* Batch badge */}
        {(scholar.spm_batch || scholar.batch) && (
          <div
            className="absolute top-3 right-3 bg-gold text-maroon text-xs font-700 px-2 py-1"
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
          >
            {scholar.spm_batch ? `SPM ${scholar.spm_batch}` : `Batch ${scholar.batch}`}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 border-t border-gold/15">
        <h3
          className="font-700 text-cream text-base leading-tight mb-1"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
        >
          {scholar.name}
        </h3>
        <p className="text-gold/80 text-xs font-times mb-2">{scholar.scholarship_name}</p>
        <p className="text-cream/45 text-xs font-times">{scholar.current_university}</p>
      </div>
    </Link>
  )
}
