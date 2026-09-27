import { Link } from 'react-router-dom'

const STATUS_CLASSES = {
  open:   'badge-open',
  closed: 'badge-closed',
  soon:   'badge-soon',
}

function getStatusInfo(status) {
  const s = (status || '').toLowerCase().trim()
  if (s === 'open') {
    return { label: 'Open', className: 'badge-open' }
  }
  if (s === 'soon' || s === 'upcoming' || s === 'opening soon') {
    return { label: 'Opening Soon', className: 'badge-soon' }
  }
  return { label: 'Closed', className: 'badge-closed' }
}

function getLocationLabel(country) {
  if (!country) return null
  const countries = country.split(', ').map(c => c.trim())
  const hasMalaysia = countries.some(c => c.toLowerCase() === 'malaysia')
  const hasOverseas = countries.some(c => c.toLowerCase() !== 'malaysia')
  if (hasMalaysia && hasOverseas) return 'Local & Overseas'
  if (hasMalaysia) return 'Local'
  return 'Overseas'
}

export default function ScholarshipCard({ scholarship }) {
  const { label: statusLabel, className: statusClass } = getStatusInfo(scholarship.status)
  const locationLabel = getLocationLabel(scholarship.country)

  return (
    <Link
      to={`/scholarships/${scholarship.id}`}
      className="card-glow glass-card overflow-hidden block"
      style={{ borderRadius: 0, borderLeft: '3px solid #E6A122' }}
    >
      {/* Logo / banner */}
      {scholarship.logo_url && (
        <div className="h-32 overflow-hidden bg-wine/30">
          <img
            src={scholarship.logo_url}
            alt={scholarship.name}
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3
            className="text-lg font-700 text-cream leading-tight"
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
          >
            {scholarship.name}
          </h3>
          <span className={`status-badge ${statusClass} shrink-0`}>
            {statusLabel}
          </span>
        </div>

        <p className="text-cream/55 text-sm font-times leading-relaxed mb-4 line-clamp-2">
          {scholarship.about}
        </p>

        {/* Details row */}
        <div className="flex flex-wrap gap-3 mb-4">
          {locationLabel && (
            <div className="flex items-center gap-1.5 text-xs text-cream/45">
              <span>📍</span>
              <span className="font-times">{locationLabel}</span>
            </div>
          )}
          {scholarship.study_duration && (
            <div className="flex items-center gap-1.5 text-xs text-cream/45">
              <span>🕐</span>
              <span className="font-times">{scholarship.study_duration}</span>
            </div>
          )}
        </div>

        {/* Eligibility badges */}
        {(scholarship.is_bumiputera || scholarship.is_anak_negeri) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {scholarship.is_bumiputera && (
              <span className="text-[11px] bg-gold/15 text-gold px-2 py-0.5 border border-gold/30 font-spartan uppercase tracking-wide" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Bumiputera
              </span>
            )}
            {scholarship.is_anak_negeri && (
              <span className="text-[11px] bg-crimson/25 text-cream px-2 py-0.5 border border-crimson/40 font-spartan uppercase tracking-wide" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Anak Negeri
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(scholarship.courses_offered) && scholarship.courses_offered.slice(0, 4).map(c => (
            <span key={c} className="text-xs bg-gold/10 text-gold/70 px-2 py-0.5 border border-gold/20 font-spartan" style={{ fontFamily: "'League Spartan', sans-serif" }}>
              {c}
            </span>
          ))}
          {Array.isArray(scholarship.courses_offered) && scholarship.courses_offered.length > 4 && (
            <span className="text-xs text-cream/30 font-times py-0.5">
              +{scholarship.courses_offered.length - 4} more
            </span>
          )}
        </div>

        <p className="text-xs text-gold/40 font-spartan uppercase tracking-wide" style={{ fontFamily: "'League Spartan', sans-serif" }}>
          View details →
        </p>
      </div>
    </Link>
  )
}
