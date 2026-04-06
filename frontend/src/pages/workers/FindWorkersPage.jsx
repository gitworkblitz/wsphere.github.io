import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { queryDocuments } from '../../services/firestoreService'
import { dummyWorkers, SERVICE_CATEGORIES, calculateWorkerScore, formatCurrencyINR } from '../../utils/dummyData'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import {
  MapPinIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon, CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function FindWorkersPage() {
  const [searchParams] = useSearchParams()
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('category') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('score')

  useEffect(() => {
    loadWorkers()
  }, [])

  const loadWorkers = async () => {
    setLoading(true)
    try {
      const data = await queryDocuments('users', 'user_type', '==', 'worker')
      setWorkers(data.length > 0 ? data : dummyWorkers)
    } catch {
      setWorkers(dummyWorkers)
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkers = useMemo(() => {
    let result = [...workers]

    // Filter by search/category
    if (searchTerm || selectedCategory) {
      const term = (searchTerm || selectedCategory).toLowerCase()
      result = result.filter(w => {
        const skills = (w.skills || []).map(s => s.toLowerCase())
        const name = (w.name || '').toLowerCase()
        const location = (w.location || '').toLowerCase()
        return skills.some(s => s.includes(term)) || name.includes(term) || location.includes(term)
      })
    }

    // Calculate scores
    result = result.map(w => ({
      ...w,
      match_score: calculateWorkerScore(w),
      distance: w.distance || Math.round(Math.random() * 10 + 1)
    }))

    // Sort
    if (sortBy === 'score') result.sort((a, b) => b.match_score - a.match_score)
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'experience') result.sort((a, b) => b.experience_years - a.experience_years)
    else if (sortBy === 'price') result.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0))

    return result
  }, [workers, searchTerm, selectedCategory, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Workers</h1>
        <p className="text-gray-500">Smart matching based on ratings, experience, and performance</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setSelectedCategory('') }}
              placeholder="Search by skill, name, or location..."
              className="input-field pl-10" />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field w-auto min-w-[160px]">
            <option value="score">Best Match</option>
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => { setSelectedCategory(''); setSearchTerm('') }}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              !selectedCategory ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>All</button>
          {SERVICE_CATEGORIES.map(c => (
            <button key={c.value} onClick={() => { setSelectedCategory(c.value); setSearchTerm(c.value) }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                selectedCategory === c.value ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{c.emoji} {c.label}</button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">{filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''} found</p>

      {/* Score formula explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-blue-800 mb-1">📊 Match Score Formula (Transparent)</p>
        <p className="text-xs text-blue-700">
          Score = (35% × Rating) + (25% × Experience) + (20% × Distance) + (20% × Completion Rate)
        </p>
      </div>

      {/* Workers grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredWorkers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">No workers found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkers.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full ${w.avatar_color || 'bg-primary-500'} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                  {(w.name || 'W')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-gray-900 truncate">{w.name}</h3>
                    <CheckBadgeIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    <span>{w.location || 'India'}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(w.skills || []).slice(0, 3).map(s => (
                  <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">{s}</span>
                ))}
              </div>

              {/* Match score bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500 font-medium">Match Score</span>
                  <span className="font-bold text-primary-600">{w.match_score}/100</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                    style={{ width: `${w.match_score}%` }} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center bg-gray-50 rounded-lg py-2">
                  <div className="flex items-center justify-center gap-0.5">
                    <StarSolid className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{w.rating}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Rating</p>
                </div>
                <div className="text-center bg-gray-50 rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-900">{w.experience_years}yr</p>
                  <p className="text-[10px] text-gray-400">Experience</p>
                </div>
                <div className="text-center bg-gray-50 rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-900">{w.completion_rate}%</p>
                  <p className="text-[10px] text-gray-400">Completion</p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrencyINR(w.hourly_rate || 500)}</span>
                  <span className="text-xs text-gray-400">/hr</span>
                </div>
                <Link to={`/services`}
                  className="btn-primary text-xs px-4 py-2">
                  View Services
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
