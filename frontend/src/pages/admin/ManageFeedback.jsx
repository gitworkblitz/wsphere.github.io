import React, { useState, useEffect, useCallback } from 'react'
import { getRecentDocuments, updateDocument, deleteDocument } from '../../services/firestoreService'
import { DashboardSkeleton } from '../../components/SkeletonLoader'
import ErrorState from '../../components/ErrorState'
import {
  MessageSquare, Clock, User, Trash2, Star, RefreshCw, Search, ThumbsUp, ThumbsDown, Filter
} from 'lucide-react'

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' }
const CATEGORY_COLORS = {
  general: 'bg-blue-50 text-blue-600',
  bug: 'bg-red-50 text-red-600',
  feature: 'bg-purple-50 text-purple-600',
  improvement: 'bg-amber-50 text-amber-600',
  complaint: 'bg-rose-50 text-rose-600',
  praise: 'bg-green-50 text-green-600',
}

export default function ManageFeedback() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)

  const loadFeedback = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRecentDocuments('feedback', 100)
      setFeedback(data)
    } catch (err) {
      console.error('Error loading feedback:', err)
      setError('Failed to load feedback')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadFeedback() }, [loadFeedback])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return
    try {
      await deleteDocument('feedback', id)
      setFeedback(prev => prev.filter(f => f.id !== id))
    } catch (err) {
      console.error('Error deleting feedback:', err)
    }
  }

  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1)
    : '0.0'

  const filtered = feedback.filter(f => {
    if (ratingFilter > 0 && (f.rating || 0) !== ratingFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (f.name || '').toLowerCase().includes(q) ||
             (f.email || '').toLowerCase().includes(q) ||
             (f.message || '').toLowerCase().includes(q) ||
             (f.category || '').toLowerCase().includes(q)
    }
    return true
  })

  if (loading) return <DashboardSkeleton />
  if (error) return <ErrorState title="Error" message={error} onRetry={loadFeedback} />

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Feedback</h1>
          <p className="text-gray-500 text-sm mt-1">{feedback.length} submissions</p>
        </div>
        <button onClick={loadFeedback} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Avg Rating</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{feedback.filter(f => (f.rating || 0) >= 4).length}</p>
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> Positive</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-amber-600">{feedback.filter(f => (f.rating || 0) === 3).length}</p>
          <p className="text-xs text-gray-500 font-medium">Neutral</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-red-600">{feedback.filter(f => (f.rating || 0) <= 2 && (f.rating || 0) > 0).length}</p>
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1"><ThumbsDown className="w-3 h-3" /> Negative</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-1">
          <button onClick={() => setRatingFilter(0)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              ratingFilter === 0 ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>All</button>
          {[5, 4, 3, 2, 1].map(r => (
            <button key={r} onClick={() => setRatingFilter(r)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
                ratingFilter === r ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {r}<Star className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No feedback found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(fb => (
            <div key={fb.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    {(fb.name || 'U')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm text-gray-900">{fb.name || 'Anonymous'}</h3>
                      {fb.category && (
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${CATEGORY_COLORS[fb.category] || CATEGORY_COLORS.general}`}>
                          {fb.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{fb.email || 'No email'}</p>
                    {/* Star Rating */}
                    {fb.rating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                        ))}
                        <span className="text-xs text-gray-500 ml-1 font-medium">{RATING_LABELS[fb.rating]}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 leading-relaxed">{fb.message || fb.feedback || 'No message'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                  </span>
                  <button onClick={() => handleDelete(fb.id)} title="Delete"
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
