import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ImageUpload from '../../components/ui/ImageUpload'

/* ── Preset courses grouped by category ─────────────────────────── */
const PRESET_COURSES = {
  'Medicine & Health': [
    'Medicine', 'Dentistry', 'Pharmacy', 'Nursing', 'Optometry',
    'Physiotherapy', 'Medical Laboratory Science', 'Dietetics', 'Radiography',
  ],
  'Engineering': [
    'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
    'Chemical Engineering', 'Computer Engineering', 'Aerospace Engineering',
    'Petroleum Engineering', 'Biomedical Engineering', 'Structural Engineering',
    'Environmental Engineering', 'Industrial Engineering',
  ],
  'Computing & IT': [
    'Computer Science', 'Information Technology', 'Software Engineering',
    'Cybersecurity', 'Data Science', 'Artificial Intelligence',
    'Network Engineering', 'Information Systems',
  ],
  'Science': [
    'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Biotechnology',
    'Environmental Science', 'Actuarial Science', 'Food Science',
    'Marine Science', 'Microbiology',
  ],
  'Business & Finance': [
    'Business Administration', 'Accounting', 'Finance', 'Economics',
    'Marketing', 'Entrepreneurship', 'Human Resource Management',
    'Supply Chain Management', 'Islamic Finance',
  ],
  'Law & Social Sciences': [
    'Law', 'Psychology', 'Sociology', 'Political Science',
    'International Relations', 'Social Work', 'Criminology', 'Public Policy',
  ],
  'Arts & Humanities': [
    'Architecture', 'Design', 'Mass Communication', 'Journalism',
    'Education', 'Fine Arts', 'Music', 'Literature', 'Linguistics',
    'History', 'Philosophy', 'Islamic Studies',
  ],
  'Other': [
    'Agriculture', 'Aviation', 'Maritime', 'Sports Science',
    'Culinary Arts', 'Hotel Management', 'Urban Planning', 'Quantity Surveying',
  ],
}


/* ── Countries (all excluding Israel) ───────────────────────────── */
const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda',
  'Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain',
  'Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
  'Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada',
  'Central African Republic','Chad','Chile','China','Colombia','Comoros',
  'Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark',
  'Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador',
  'Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji',
  'Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece',
  'Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras',
  'Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Italy',
  'Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait',
  'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya',
  'Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia',
  'Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius',
  'Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco',
  'Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand',
  'Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway',
  'Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay',
  'Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda',
  'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines',
  'Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal',
  'Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Solomon Islands','Somalia','South Africa','South Korea','South Sudan',
  'Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
  'Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga',
  'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda',
  'Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay',
  'Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen',
  'Zambia','Zimbabwe',
]

const EMPTY = {
  name: '', status: 'closed', about: '', courses_offered: [],
  study_duration: '', countries: [], application_url: '',
  extra_details: '', income_group: '',
  min_result: '', logo_url: '',
  is_bumiputera: false, is_anak_negeri: false,
}

const STATUS_OPTIONS = ['open', 'soon', 'closed']

export default function EditScholarships() {
  const [scholarships, setScholarships] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [form,         setForm]         = useState(EMPTY)
  const [editing,      setEditing]      = useState(null)
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState('')
  const [search,       setSearch]       = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('scholarships').select('*').order('name')
    setScholarships(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew  = ()  => { setForm(EMPTY); setEditing('new'); setError('') }
  const openEdit = (s) => {
    setForm({
      ...EMPTY, ...s,
      courses_offered: Array.isArray(s.courses_offered) ? s.courses_offered : [],
      countries: s.country ? s.country.split(', ').filter(Boolean) : [],
      is_bumiputera: Boolean(s.is_bumiputera),
      is_anak_negeri: Boolean(s.is_anak_negeri),
    })
    setEditing(s.id)
    setError('')
  }
  const cancel = () => { setEditing(null); setError('') }
  const set    = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleCountry = (country) => {
    setForm(f => {
      const arr = f.countries
      return {
        ...f,
        countries: arr.includes(country)
          ? arr.filter(c => c !== country)
          : [...arr, country],
      }
    })
  }

  const toggleCourse = (course) => {
    setForm(f => {
      const arr = f.courses_offered
      return {
        ...f,
        courses_offered: arr.includes(course)
          ? arr.filter(c => c !== course)
          : [...arr, course],
      }
    })
  }

  const handleSave = async () => {
    if (!form.name) { setError('Scholarship name is required.'); return }
    setSaving(true)
    setError('')
    const payload = {
      name:            form.name,
      status:          form.status,
      about:           form.about           || null,
      courses_offered: form.courses_offered.length ? form.courses_offered : null,
      study_duration:  form.study_duration  || null,
      country:         form.countries.length ? form.countries.join(', ') : null,
      application_url: form.application_url || null,
      extra_details:   form.extra_details   || null,
      income_group:    form.income_group    || null,
      min_result:      form.min_result      || null,
      logo_url:        form.logo_url        || null,
      is_bumiputera:   Boolean(form.is_bumiputera),
      is_anak_negeri:  Boolean(form.is_anak_negeri),
    }
    if (editing === 'new') {
      const { error: e } = await supabase.from('scholarships').insert(payload)
      if (e) { setError(e.message); setSaving(false); return }
    } else {
      const { error: e } = await supabase.from('scholarships').update(payload).eq('id', editing)
      if (e) { setError(e.message); setSaving(false); return }
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete scholarship "${name}"? This cannot be undone.`)) return
    await supabase.from('scholarships').delete().eq('id', id)
    load()
  }

  const quickStatus = async (id, status) => {
    await supabase.from('scholarships').update({ status }).eq('id', id)
    setScholarships(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const filtered = scholarships.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase())
  )

  const STATUS_CLASSES = { open: 'badge-open', closed: 'badge-closed', soon: 'badge-soon' }

  return (
    <div className="page-enter pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-gold/60 text-xs font-700 tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
              Admin
            </p>
            <h1 className="text-4xl font-900 text-cream" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>
              Edit <span className="text-gold">Scholarships</span>
            </h1>
          </div>
          <button onClick={openNew} className="btn-primary">+ Add Scholarship</button>
        </div>

        {/* Inline form */}
        {editing && (
          <div className="glass-card p-6 mb-8" style={{ borderRadius: 0, borderLeft: '3px solid #E6A122' }}>
            <h2 className="text-lg font-700 text-gold mb-5" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
              {editing === 'new' ? 'Add New Scholarship' : 'Edit Scholarship'}
            </h2>
            {error && <div className="mb-4 p-3 bg-crimson/20 border border-crimson/30 text-sm text-red-300 font-times">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <AField label="Scholarship Name *" value={form.name}            onChange={v => set('name', v)}            placeholder="JPA Scholarship" />
              <ImageUpload label="Logo / Banner" value={form.logo_url} onChange={v => set('logo_url', v)} bucket="scholarship-logos" />
              <div className="md:col-span-2">
                <CountryPicker
                  selected={form.countries}
                  onToggle={toggleCountry}
                />
              </div>
              <AField label="Study Duration"      value={form.study_duration}  onChange={v => set('study_duration', v)}  placeholder="3–5 years" />
              <AField label="Application URL"     value={form.application_url} onChange={v => set('application_url', v)} placeholder="https://jpa.gov.my/…" />
              <AField label="Minimum Result"      value={form.min_result}      onChange={v => set('min_result', v)}      placeholder="9A SPM / 4.0 CGPA" />
              <AField label="Income Group"        value={form.income_group}    onChange={v => set('income_group', v)}    placeholder="B40, M40, Open" />

              {/* Status */}
              <div>
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Status
                </label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className="keris-input">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>

              {/* About */}
              <div className="md:col-span-2">
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  About
                </label>
                <textarea
                  value={form.about}
                  onChange={e => set('about', e.target.value)}
                  rows={3}
                  placeholder="Brief description of this scholarship…"
                  className="keris-input resize-none"
                />
              </div>

              {/* Extra Details */}
              <div className="md:col-span-2">
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Extra Details
                </label>
                <textarea
                  value={form.extra_details}
                  onChange={e => set('extra_details', e.target.value)}
                  rows={2}
                  placeholder="e.g. Merit-based, priority to low-income households, etc…"
                  className="keris-input resize-none"
                />
              </div>

              {/* Special Quota & Eligibility */}
              <div className="md:col-span-2 flex flex-wrap gap-6 p-4 bg-maroon/30 border border-gold/15">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(form.is_bumiputera)}
                    onChange={e => set('is_bumiputera', e.target.checked)}
                    className="accent-gold w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-cream/80 font-spartan uppercase tracking-wider" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                    Bumiputera Only
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(form.is_anak_negeri)}
                    onChange={e => set('is_anak_negeri', e.target.checked)}
                    className="accent-gold w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-cream/80 font-spartan uppercase tracking-wider" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                    Anak Negeri Kelantan
                  </span>
                </label>
              </div>

              {/* Courses Offered */}
              <div className="md:col-span-2">
                <CoursePicker
                  selected={form.courses_offered}
                  onToggle={toggleCourse}
                  onAdd={course => { if (!form.courses_offered.includes(course)) toggleCourse(course) }}
                  onRemove={course => toggleCourse(course)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving…' : editing === 'new' ? 'Add Scholarship' : 'Save Changes'}
              </button>
              <button onClick={cancel} className="btn-outline">Cancel</button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search scholarships…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="keris-input max-w-sm"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="keris-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Country</th>
                  <th>Courses</th>
                  <th>Income</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-cream/30 py-8 font-times">No scholarships found.</td>
                  </tr>
                ) : filtered.map(s => (
                  <tr key={s.id}>
                    <td className="font-times text-cream/80">
                      <div>{s.name}</div>
                      {(s.is_bumiputera || s.is_anak_negeri) && (
                        <div className="flex gap-1.5 mt-1">
                          {s.is_bumiputera && (
                            <span className="text-[10px] bg-gold/15 text-gold px-1.5 py-0.5 border border-gold/30 font-spartan uppercase">
                              Bumiputera
                            </span>
                          )}
                          {s.is_anak_negeri && (
                            <span className="text-[10px] bg-crimson/20 text-cream/90 px-1.5 py-0.5 border border-crimson/40 font-spartan uppercase">
                              Anak Negeri
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="relative group">
                        <span className={`status-badge ${STATUS_CLASSES[s.status] || 'badge-closed'} cursor-pointer`}>
                          {s.status}
                        </span>
                        <div className="hidden group-hover:flex absolute top-full left-0 z-10 flex-col bg-maroon border border-gold/20 shadow-lg mt-1">
                          {STATUS_OPTIONS.filter(o => o !== s.status).map(o => (
                            <button
                              key={o}
                              onClick={() => quickStatus(s.id, o)}
                              className={`px-3 py-1.5 text-xs text-left hover:bg-gold/10 transition-colors font-spartan uppercase tracking-wide ${STATUS_CLASSES[o]}`}
                              style={{ fontFamily: "'League Spartan', sans-serif" }}
                            >
                              → {o}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="text-cream/50 font-times">{s.country || '—'}</td>
                    <td className="text-cream/50 font-times text-xs">
                      {Array.isArray(s.courses_offered) && s.courses_offered.length
                        ? s.courses_offered.slice(0, 3).join(', ') + (s.courses_offered.length > 3 ? ` +${s.courses_offered.length - 3}` : '')
                        : '—'}
                    </td>
                    <td className="text-cream/50 font-times text-xs">{s.income_group || '—'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="text-xs text-gold/60 hover:text-gold transition-colors font-spartan uppercase"
                          style={{ fontFamily: "'League Spartan', sans-serif" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="text-xs text-crimson/60 hover:text-crimson transition-colors font-spartan uppercase"
                          style={{ fontFamily: "'League Spartan', sans-serif" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── CoursePicker ────────────────────────────────────────────────── */
function CoursePicker({ selected, onToggle, onAdd }) {
  const [query, setQuery]           = useState('')
  const [customInput, setCustomInput] = useState('')

  const handleAddCustom = () => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setCustomInput('')
  }

  const q = query.toLowerCase()
  const suggestions = q.length < 1 ? [] : Object.values(PRESET_COURSES).flat().filter(
    c => c.toLowerCase().includes(q) && !selected.includes(c)
  )

  return (
    <div>
      <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-3" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        Courses Offered
        {selected.length > 0 && (
          <span className="ml-2 text-gold/60 normal-case tracking-normal">({selected.length} selected)</span>
        )}
      </label>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map(course => (
            <span
              key={course}
              className="flex items-center gap-1.5 text-xs bg-gold/15 text-gold border border-gold/30 px-2.5 py-1 font-spartan"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              {course}
              <button
                type="button"
                onClick={() => onToggle(course)}
                className="text-gold/50 hover:text-crimson transition-colors leading-none text-sm"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search presets */}
      <div className="relative mb-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search courses to add…"
          className="keris-input text-sm"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 border border-gold/20 shadow-lg max-h-48 overflow-y-auto" style={{ background: '#1a0505' }}>
            {suggestions.map(course => (
              <button
                key={course}
                type="button"
                onClick={() => { onToggle(course); setQuery('') }}
                className="w-full text-left px-3 py-2 text-sm text-cream/70 hover:bg-gold/10 hover:text-cream transition-colors font-times"
              >
                {course}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add custom course */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
          placeholder="Or add a custom course…"
          className="keris-input flex-1 text-sm"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="btn-outline text-xs px-4"
        >
          Add
        </button>
      </div>
    </div>
  )
}

/* ── CountryPicker ───────────────────────────────────────────────── */
function CountryPicker({ selected, onToggle }) {
  const [query, setQuery] = useState('')

  const q = query.toLowerCase()
  const suggestions = q.length < 1 ? [] : COUNTRIES.filter(
    c => c.toLowerCase().includes(q) && !selected.includes(c)
  )

  return (
    <div>
      <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-3" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        Country / Location
        {selected.length > 0 && (
          <span className="ml-2 text-gold/60 normal-case tracking-normal">({selected.length} selected)</span>
        )}
      </label>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map(country => (
            <span
              key={country}
              className="flex items-center gap-1.5 text-xs bg-gold/15 text-gold border border-gold/30 px-2.5 py-1 font-spartan"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              {country}
              <button
                type="button"
                onClick={() => onToggle(country)}
                className="text-gold/50 hover:text-crimson transition-colors leading-none text-sm"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search country to add…"
          className="keris-input text-sm"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 border border-gold/20 shadow-lg max-h-48 overflow-y-auto" style={{ background: '#1a0505' }}>
            {suggestions.map(country => (
              <button
                key={country}
                type="button"
                onClick={() => { onToggle(country); setQuery('') }}
                className="w-full text-left px-3 py-2 text-sm text-cream/70 hover:bg-gold/10 hover:text-cream transition-colors font-times"
              >
                {country}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        {label}
      </label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="keris-input" />
    </div>
  )
}
