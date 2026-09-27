import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ImageUpload from '../../components/ui/ImageUpload'

const DEPARTMENTS = [
  'Directors',
  'Secretarial & Finance',
  'Programmes & PR',
  'Content & Resources',
  'Publicity & Design',
  'Technical',
]

const EMPTY = {
  name: '', role: '', department: 'Directors', batch_year: 2026, is_head: false, photo_url: '',
}

export default function EditCommittee() {
  const [members,  setMembers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [form,     setForm]     = useState(EMPTY)
  const [editing,  setEditing]  = useState(null) // id or 'new'
  const [saving,   setSaving]   = useState(false)
  const [filterDept, setFilterDept] = useState('all')
  const [error,    setError]    = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('committee')
      .select('*')
      .order('department')
    setMembers(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew  = ()  => { setForm(EMPTY); setEditing('new'); setError('') }
  const openEdit = (m) => {
    setForm({
      ...EMPTY,
      ...m,
      batch_year: m.batch_year ?? '',
      is_head: m.is_head ?? false,
    })
    setEditing(m.id)
    setError('')
  }
  const cancel   = ()  => { setEditing(null); setError('') }
  const set      = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required.'); return }
    setSaving(true)
    setError('')
    const payload = {
      name:       form.name.trim(),
      role:       form.role.trim() || null,
      department: form.department,
      batch_year: form.batch_year ? parseInt(form.batch_year) : null,
      is_head:    form.department === 'Directors' ? false : form.is_head,
      photo_url:  form.photo_url || null,
    }
    const { error: e } = editing === 'new'
      ? await supabase.from('committee').insert(payload)
      : await supabase.from('committee').update(payload).eq('id', editing)
    if (e) { setError(e.message); setSaving(false); return }
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    await supabase.from('committee').delete().eq('id', id)
    load()
  }

  const displayed = filterDept === 'all'
    ? members
    : members.filter(m => m.department === filterDept)

  return (
    <div className="page-enter pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-gold/60 text-xs font-700 tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
              Admin
            </p>
            <h1 className="text-4xl font-900 text-cream" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}>
              Edit <span className="text-gold">Committee</span>
            </h1>
          </div>
          <button onClick={openNew} className="btn-primary">+ Add Member</button>
        </div>

        {/* Inline form */}
        {editing && (
          <div className="glass-card p-6 mb-8" style={{ borderRadius: 0, borderLeft: '3px solid #E6A122' }}>
            <h2 className="text-lg font-700 text-gold mb-5" style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}>
              {editing === 'new' ? 'Add New Member' : 'Edit Member'}
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-crimson/20 border border-crimson/30 text-sm text-red-300 font-times">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="Full Name *" value={form.name} onChange={v => set('name', v)} placeholder="Ahmad Zulkifli" />
              <Field label="Role / Title" value={form.role} onChange={v => set('role', v)} placeholder="e.g. Head of Department" />

              {/* Department */}
              <div>
                <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                  Department
                </label>
                <select
                  value={form.department}
                  onChange={e => set('department', e.target.value)}
                  className="keris-input"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Batch Year */}
              <Field label="Batch Year" value={form.batch_year} onChange={v => set('batch_year', v)} placeholder="2026" type="number" />

              {/* Head of dept toggle — hidden for Directors */}
              {form.department !== 'Directors' && (
                <div className="flex items-center gap-3 pt-2 md:col-span-2">
                  <input
                    type="checkbox"
                    id="is_head"
                    checked={form.is_head}
                    onChange={e => set('is_head', e.target.checked)}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="is_head" className="text-xs text-cream/60 font-spartan uppercase tracking-wider cursor-pointer" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                    Head of Department
                  </label>
                </div>
              )}

              {/* Photo */}
              <div className="md:col-span-2">
                <ImageUpload
                  label="Photo"
                  value={form.photo_url}
                  onChange={v => set('photo_url', v)}
                  bucket="committee-photos"
                  aspect="portrait"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving…' : editing === 'new' ? 'Add Member' : 'Save Changes'}
              </button>
              <button onClick={cancel} className="btn-outline">Cancel</button>
            </div>
          </div>
        )}

        {/* Filter by department */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterDept('all')}
            className={`px-3 py-1.5 text-xs font-700 uppercase tracking-wider border transition-colors ${filterDept === 'all' ? 'bg-gold text-maroon border-gold' : 'text-cream/50 border-gold/20 hover:border-gold/40'}`}
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700, borderRadius: 0 }}
          >
            All
          </button>
          {DEPARTMENTS.map(d => (
            <button
              key={d}
              onClick={() => setFilterDept(d)}
              className={`px-3 py-1.5 text-xs font-700 uppercase tracking-wider border transition-colors ${filterDept === d ? 'bg-gold text-maroon border-gold' : 'text-cream/50 border-gold/20 hover:border-gold/40'}`}
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700, borderRadius: 0 }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <p className="text-center text-cream/30 font-times py-16">No members found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="keris-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Year</th>
                  <th>Head</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {member.photo_url ? (
                          <img src={member.photo_url} alt="" className="w-8 h-8 object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 bg-wine/40 flex items-center justify-center text-xs text-gold/60 font-spartan flex-shrink-0" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                            {member.name?.charAt(0)}
                          </div>
                        )}
                        <span className="font-times text-cream/80">{member.name}</span>
                      </div>
                    </td>
                    <td className="text-cream/50 font-times text-sm">{member.department}</td>
                    <td className="text-cream/50 font-times text-sm">{member.role || '—'}</td>
                    <td className="text-cream/50 font-times text-sm">{member.batch_year ?? '—'}</td>
                    <td className="text-cream/50 font-times text-sm">
                      {member.department !== 'Directors' && member.is_head ? (
                        <span className="text-gold text-xs font-spartan uppercase" style={{ fontFamily: "'League Spartan', sans-serif" }}>Yes</span>
                      ) : '—'}
                    </td>
                    <td>
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(member)} className="text-xs text-gold/60 hover:text-gold transition-colors font-spartan uppercase" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(member.id, member.name)} className="text-xs text-crimson/60 hover:text-crimson transition-colors font-spartan uppercase" style={{ fontFamily: "'League Spartan', sans-serif" }}>
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

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs text-cream/35 font-spartan uppercase tracking-wider mb-1.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="keris-input" />
    </div>
  )
}
