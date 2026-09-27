import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ImageUpload from '../../components/ui/ImageUpload'

const EMPTY = {
  name: '', spm_batch: '', scholarship_id: '', past_school: '',
  current_university: '', course: '', photo_url: '', instagram: '', contact_email: '', about: '',
}

export default function EditScholars() {
  const [scholars,     setScholars]     = useState([])
  const [scholarships, setScholarships] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [form,         setForm]         = useState(EMPTY)
  const [editing,      setEditing]      = useState(null) // id or 'new'
  const [saving,       setSaving]       = useState(false)
  const [search,       setSearch]       = useState('')
  const [error,        setError]        = useState('')

  const load = async () => {
    setLoading(true)
    const [{ data: s, error: errS }, { data: sh, error: errSh }] = await Promise.all([
      supabase.from('scholars').select('*, scholarships(name)').order('spm_batch', { ascending: false }),
      supabase.from('scholarships').select('id, name').order('name'),
    ])
    if (errS) console.error('Error loading scholars:', errS)
    if (errSh) console.error('Error loading scholarships:', errSh)
    setScholars(s || [])
    setScholarships(sh || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew  = ()  => { setForm(EMPTY); setEditing('new'); setError('') }
  const openEdit = (s) => { setForm({ ...EMPTY, ...s }); setEditing(s.id); setError('') }
  const cancel   = ()  => { setEditing(null); setError('') }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name) { setError('Name is required.'); return }
    setSaving(true)
    setError('')
    const payload = {
      name: form.name,
      spm_batch: form.spm_batch ? parseInt(form.spm_batch) : null,
      scholarship_id: form.scholarship_id || null,
      past_school: form.past_school || null,
      current_university: form.current_university || null,
      course: form.course || null,
      photo_url: form.photo_url || null,
      instagram: form.instagram ? form.instagram.replace(/^@/, '') : null,
      contact_email: form.contact_email || null,
      about: form.about || null,
    }
    if (editing === 'new') {
      const { error: e } = await supabase.from('scholars').insert(payload)
      if (e) { setError(e.message); setSaving(false); return }
    } else {
      const { error: e } = await supabase.from('scholars').update(payload).eq('id', editing)
      if (e) { setError(e.message); setSaving(false); return }
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete scholar "${name}"? This cannot be undone.`)) return
    await supabase.from('scholars').delete().eq('id', id)
    load()
  }

  const filtered = scholars.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase())
  )

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
              Edit <span className="text-gold">Scholars</span>
            </h1>
          </div>
          <button onClick={openNew} className="btn-primary">+ Add Scholar</button>
        </div>

        {/* Inline form */}
        {editing && (
          <div className="glass-card p-6 mb-8" style={{ borderRadius: 0, borderLeft: '3px solid #E6A122' }}>
            <h2 className="text-lg font-700 text-gold mb-5" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
              {editing === 'new' ? 'Add New Scholar' : 'Edit Scholar'}
            </h2>
            {error && <div className="mb-4 p-3 bg-crimson/20 border border-crimson/30 text-sm text-red-300 font-times">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <AdminField label="Full Name *"       value={form.name}          onChange={v => set('name', v)}          placeholder="Ahmad Zulkifli" />
              <AdminField label="SPM Batch (Year)" value={form.spm_batch}     onChange={v => set('spm_batch', v)}     placeholder="2023" type="number" />
              <AdminField label="Past School"         value={form.past_school}        onChange={v => set('past_school', v)}        placeholder="SMK Likas" />
              <AdminField label="Current University" value={form.current_university} onChange={v => set('current_university', v)} placeholder="Universiti Malaya" />
              <AdminField label="Course"             value={form.course}             onChange={v => set('course', v)}             placeholder="Computer Science" />
              <AdminField label="Contact Email"     value={form.contact_email} onChange={v => set('contact_email', v)} placeholder="ahmad@email.com" />
              <ImageUpload label="Photo" value={form.photo_url} onChange={v => set('photo_url', v)} bucket="scholar-photos" aspect="portrait" />
              <AdminField label="Instagram Username" value={form.instagram}   onChange={v => set('instagram', v)}     placeholder="@ahmadzulkifli" />

              {/* Scholarship select */}
              <div className="md:col-span-2">
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Scholarship
                </label>
                <select
                  value={form.scholarship_id}
                  onChange={e => set('scholarship_id', e.target.value)}
                  className="keris-input"
                >
                  <option value="">— Select scholarship —</option>
                  {scholarships.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  About / Bio
                </label>
                <textarea
                  value={form.about}
                  onChange={e => set('about', e.target.value)}
                  rows={3}
                  placeholder="Brief bio about the scholar…"
                  className="keris-input resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving…' : editing === 'new' ? 'Add Scholar' : 'Save Changes'}
              </button>
              <button onClick={cancel} className="btn-outline">Cancel</button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search scholars…"
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
                  <th>SPM Batch</th>
                  <th>Scholarship</th>
                  <th>University</th>
                  <th>Instagram</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-cream/30 py-8 font-times">
                      No scholars found.
                    </td>
                  </tr>
                ) : filtered.map(scholar => (
                  <tr key={scholar.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {scholar.photo_url ? (
                          <img src={scholar.photo_url} alt="" className="w-8 h-8 object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-wine/40 flex items-center justify-center text-xs text-gold/60 font-spartan" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            {scholar.name?.charAt(0)}
                          </div>
                        )}
                        <span className="font-times text-cream/80">{scholar.name}</span>
                      </div>
                    </td>
                    <td className="text-cream/50 font-times">{scholar.spm_batch ?? '—'}</td>
                    <td className="text-cream/50 font-times">{scholar.scholarships?.name || '—'}</td>
                    <td className="text-cream/50 font-times">{scholar.current_university || '—'}</td>
                    <td className="text-cream/50 font-times text-xs">{scholar.instagram ? `@${scholar.instagram}` : '—'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(scholar)}
                          className="text-xs text-gold/60 hover:text-gold transition-colors font-spartan uppercase"
                          style={{ fontFamily: "'League Spartan', sans-serif" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(scholar.id, scholar.name)}
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

function AdminField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="keris-input" />
    </div>
  )
}
