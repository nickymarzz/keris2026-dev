import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ImageUpload from '../../components/ui/ImageUpload'

const EMPTY = {
  year: new Date().getFullYear(),
  title: '',
  body: '',
  image_url: '',
}

export default function EditHistory() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(EMPTY)
  const [editing, setEditing] = useState(null) // id or 'new'
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')

  const load = async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('history_entries')
      .select('*')
      .order('year', { ascending: false })
    if (err) console.error('Error loading history entries:', err)
    setEntries(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew  = ()  => { setForm(EMPTY); setEditing('new'); setError('') }
  const openEdit = (e) => { setForm({ ...EMPTY, ...e }); setEditing(e.id); setError('') }
  const cancel   = ()  => { setEditing(null); setError('') }
  const set      = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.year) { setError('Year is required.'); return }
    setSaving(true)
    setError('')

    const payload = {
      year: parseInt(form.year),
      title: form.title.trim(),
      body: form.body?.trim() || null,
      image_url: form.image_url || null,
    }

    const { error: e } = editing === 'new'
      ? await supabase.from('history_entries').insert(payload)
      : await supabase.from('history_entries').update(payload).eq('id', editing)

    if (e) { setError(e.message); setSaving(false); return }
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete milestone "${title}"? This cannot be undone.`)) return
    await supabase.from('history_entries').delete().eq('id', id)
    load()
  }

  const filtered = entries.filter(e =>
    !search ||
    String(e.year).includes(search) ||
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.body?.toLowerCase().includes(search.toLowerCase())
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
              Edit <span className="text-gold">History & Milestones</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="btn-outline text-xs">← Dashboard</Link>
            <button onClick={openNew} className="btn-primary text-xs">+ Add Milestone</button>
          </div>
        </div>

        {/* Form modal/panel */}
        {editing && (
          <div className="glass-card p-6 mb-8 border-gold/30" style={{ borderRadius: 0 }}>
            <h2 className="text-lg font-700 text-gold mb-5" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
              {editing === 'new' ? 'Add New Milestone' : 'Edit Milestone'}
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-crimson/20 border border-crimson/30 text-sm text-red-300 font-times">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Year *
                </label>
                <input
                  type="number"
                  value={form.year}
                  onChange={e => set('year', e.target.value)}
                  className="keris-input"
                  placeholder="2026"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Milestone Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  className="keris-input"
                  placeholder="e.g. KERIS Founded"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Description / Story
                </label>
                <textarea
                  value={form.body}
                  onChange={e => set('body', e.target.value)}
                  rows={3}
                  className="keris-input resize-none"
                  placeholder="Describe the milestone and its impact on the KERIS movement…"
                />
              </div>

              <div className="md:col-span-3">
                <ImageUpload
                  label="Milestone Photo"
                  value={form.image_url}
                  onChange={v => set('image_url', v)}
                  bucket="history-images"
                  aspect="square"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving…' : editing === 'new' ? 'Add Milestone' : 'Save Changes'}
              </button>
              <button onClick={cancel} className="btn-outline">Cancel</button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search milestones by year or title…"
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
        ) : filtered.length === 0 ? (
          <p className="text-center text-cream/30 font-times py-16">No history milestones found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="keris-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Milestone</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(entry => (
                  <tr key={entry.id}>
                    <td className="font-spartan text-gold font-700 text-base">{entry.year}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        {entry.image_url ? (
                          <img src={entry.image_url} alt="" className="w-10 h-10 object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 bg-wine/40 flex items-center justify-center text-xs text-gold/60 font-spartan flex-shrink-0" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            🏛️
                          </div>
                        )}
                        <span className="font-times text-cream/90 font-bold">{entry.title}</span>
                      </div>
                    </td>
                    <td className="text-cream/50 font-times text-xs max-w-md line-clamp-2">
                      {entry.body || '—'}
                    </td>
                    <td>
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(entry)} className="text-xs text-gold/60 hover:text-gold transition-colors font-spartan uppercase" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(entry.id, entry.title)} className="text-xs text-crimson/60 hover:text-crimson transition-colors font-spartan uppercase" style={{ fontFamily: "'League Spartan', sans-serif" }}>
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
