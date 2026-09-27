import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import ScholarCard from '../components/ui/ScholarCard'

export default function Scholars() {
  const [scholars, setScholars] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('all')
  const [selectedScholarship, setSelectedScholarship] = useState('all')

  useEffect(() => {
    supabase
      .from('scholars')
      .select('*, scholarships(name)')
      .order('spm_batch', { ascending: false })
      .then(({ data }) => {
        const mapped = (data || []).map(s => ({
          ...s,
          scholarship_name: s.scholarships?.name || s.scholarship_name || '—',
        }))
        setScholars(mapped)
        setLoading(false)
      })
  }, [])

  const batches = useMemo(() => {
    const b = [...new Set(scholars.map(s => s.spm_batch).filter(Boolean))].sort((a, b) => b - a)
    return b
  }, [scholars])

  const scholarshipNames = useMemo(() => {
    const s = [...new Set(scholars.map(s => s.scholarship_name).filter(n => n && n !== '—'))]
    return s.sort()
  }, [scholars])

  const filtered = useMemo(() => {
    return scholars.filter(s => {
      const matchSearch =
        !search ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.scholarship_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.past_school?.toLowerCase().includes(search.toLowerCase()) ||
        s.current_university?.toLowerCase().includes(search.toLowerCase()) ||
        s.course?.toLowerCase().includes(search.toLowerCase())
      const matchBatch = selectedBatch === 'all' || String(s.spm_batch) === selectedBatch || String(s.batch) === selectedBatch
      const matchScholarship = selectedScholarship === 'all' || s.scholarship_name === selectedScholarship
      return matchSearch && matchBatch && matchScholarship
    })
  }, [scholars, search, selectedBatch, selectedScholarship])


  return (
    <div className="page-enter pt-24 pb-20 bg-gradient-to-b from-wine/30 via-wine/20 to-wine/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <p
          className="text-gold/60 text-xs font-700 tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 700 }}
        >
          Our People
        </p>
        <h1
          className="text-5xl md:text-7xl font-900 text-cream leading-none mb-4"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
        >
          KERIS <span className="text-gold">Scholars</span>
        </h1>
        <p className="text-cream/50 font-times text-lg max-w-xl leading-relaxed">
          Malaysian scholars making their mark across Malaysia and beyond.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, scholarship, school…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="keris-input !pl-11"
            />
          </div>

          {/* Batch filter */}
          <select
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
            className="keris-input md:w-40"
          >
            <option value="all">All Batches</option>
            {batches.map(b => (
              <option key={b} value={String(b)}>SPM {b}</option>
            ))}
          </select>

          {/* Scholarship filter */}
          <select
            value={selectedScholarship}
            onChange={e => setSelectedScholarship(e.target.value)}
            className="keris-input md:w-52"
          >
            <option value="all">All Scholarships</option>
            {scholarshipNames.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Result count */}
        <p className="text-cream/30 text-xs font-times mt-3">
          Showing {filtered.length} scholar{filtered.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/30 font-times text-lg">No scholars found.</p>
            <button
              onClick={() => { setSearch(''); setSelectedBatch('all'); setSelectedScholarship('all') }}
              className="mt-4 text-gold/60 hover:text-gold text-sm font-spartan uppercase tracking-wide transition-colors"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(scholar => (
              <ScholarCard key={scholar.id} scholar={scholar} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
