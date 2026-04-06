import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import { getAllGigs } from '../../services/firestoreService'
import GigCard from '../../components/GigCard'
import { PageLoader } from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import { dummyGigs, formatCurrencyINR } from '../../utils/dummyData'

const CATEGORIES = [
  { label: 'All', value: 'All', emoji: '🔥' },
  { label: 'Web Dev', value: 'Web Development', emoji: '💻' },
  { label: 'Mobile', value: 'Mobile Development', emoji: '📱' },
  { label: 'UI/UX', value: 'UI/UX Design', emoji: '🎨' },
  { label: 'Graphics', value: 'Graphic Design', emoji: '✏️' },
  { label: 'Writing', value: 'Content Writing', emoji: '📝' },
  { label: 'Marketing', value: 'Digital Marketing', emoji: '📊' },
  { label: 'Video', value: 'Video Editing', emoji: '🎬' },
  { label: 'Photo', value: 'Photography', emoji: '📸' },
  { label: 'Data Entry', value: 'Data Entry', emoji: '📋' },
  { label: 'QA Testing', value: 'QA Testing', emoji: '🧪' },
  { label: 'Consulting', value: 'Consulting', emoji: '💼' },
]

const BUDGET_RANGES = [
  { label: 'Any Budget', min: 0, max: Infinity },
  { label: 'Under ₹5K', min: 0, max: 5000 },
  { label: '₹5K – ₹10K', min: 5000, max: 10000 },
  { label: '₹10K – ₹20K', min: 10000, max: 20000 },
  { label: 'Above ₹20K', min: 20000, max: Infinity },
]

export default function GigsPage() {
  const { user } = useAuth()
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [budgetRange, setBudgetRange] = useState(0)

  useEffect(() => {
    loadGigs()
  }, [])

  const loadGigs = async () => {
    setLoading(true)
    try {
      const data = await getAllGigs()
      setGigs(data.length > 0 ? data : dummyGigs)
    } catch {
      setGigs(dummyGigs)
    } finally { setLoading(false) }
  }

  const filtered = useMemo(() => {
    const range = BUDGET_RANGES[budgetRange]
    return gigs.filter(g => {
      const matchSearch = !search || g.title?.toLowerCase().includes(search.toLowerCase()) || g.description?.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || g.category === category
      const budget = Number(g.price || g.budget || 0)
      const matchBudget = budget >= range.min && budget <= range.max
      return matchSearch && matchCat && matchBudget
    })
  }, [gigs, search, category, budgetRange])

  const openCount = gigs.filter(g => g.status === 'active' || g.status === 'open').length

  if (loading) return <PageLoader text="Loading gigs…" />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Marketplace Header */}
      <div className="bg-gradient-to-r from-violet-600 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-sm font-medium px-3 py-1 rounded-full mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {openCount} Active Gigs
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Freelance Gig Marketplace</h1>
              <p className="text-white/80 text-lg">Find gigs, earn money, grow your freelance career</p>
            </div>
            {user && (
              <Link to="/gigs/create" className="group bg-white text-violet-700 font-semibold px-6 py-3 rounded-xl hover:bg-violet-50 transition-all shadow-lg flex items-center gap-2 self-start">
                <PlusIcon className="w-5 h-5" />
                Post a Gig
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card border border-gray-100 dark:border-gray-800 p-4 mb-6 -mt-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gigs…" className="input-field pl-10" />
            </div>
            <select value={budgetRange} onChange={e => setBudgetRange(Number(e.target.value))} className="input-field w-auto min-w-[160px]">
              {BUDGET_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c.value}
              onClick={() => setCategory(c.value)}
              className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                category === c.value
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/30'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300'
              }`}>
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{filtered.length} gig{filtered.length !== 1 ? 's' : ''} found</p>

        {filtered.length > 0
          ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map(g => <GigCard key={g.id} gig={g} />)}</div>
          : <EmptyState icon={MagnifyingGlassIcon} title="No gigs found" description="Try adjusting your search or category" actionLabel="Post a Gig" actionTo="/gigs/create" />
        }
      </div>
    </div>
  )
}
