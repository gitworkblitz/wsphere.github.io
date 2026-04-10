import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { applyToGig, hasUserAppliedToGig } from '../services/firestoreService'
import { formatCurrencyINR } from '../utils/dummyData'
import { MapPinIcon, UserIcon, ClockIcon, StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, StarIcon as StarSolidIcon, CurrencyRupeeIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

const GigCard = React.memo(function GigCard({ gig }) {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)

  const isAssignedToMe = gig.assignedTo === user?.uid
  const isOpen = gig.status === 'open' || gig.status === 'active'

  useEffect(() => {
    if (user && gig?.id) {
      hasUserAppliedToGig(gig.id, user.uid).then(setApplied).catch(console.error)
    }
  }, [user, gig?.id])

  const handleApply = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (applied) return

    setApplying(true)
    try {
      await applyToGig({
        gigId: gig.id,
        userId: user.uid,
        userName: userProfile?.name || 'User',
        applicantName: userProfile?.name || 'User',
        userEmail: user.email || '',
        gigTitle: gig.title || '',
        employerId: gig.employer_id || gig.posted_by || '',
      })
      setApplied(true)
      toast.success('Applied Successfully ✅')
    } catch (err) {
      if (err.message?.includes('already applied')) {
        setApplied(true)
        toast.error('You have already applied to this gig')
      } else {
        toast.error(err.message || 'Failed to apply')
      }
    } finally { setApplying(false) }
  }

  const postedDaysAgo = () => {
    if (!gig.createdAt) return ''
    const days = Math.floor((Date.now() - new Date(gig.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Posted today'
    if (days === 1) return 'Posted 1 day ago'
    return `Posted ${days} days ago`
  }

  const clientRating = gig.client_details?.rating || 4.5
  const clientProjects = gig.client_details?.projects_posted || 0

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-card-hover transition-all duration-300 flex flex-col group">
      {/* Title & Time */}
      <div className="flex items-start justify-between mb-2 gap-4">
        <Link to={`/gigs/${gig.id}`} className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2">
            {gig.title}
          </h3>
        </Link>
        {applied ? (
          <span className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 text-sm font-semibold whitespace-nowrap bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg">
            <CheckCircleIcon className="w-5 h-5" /> Applied
          </span>
        ) : isAssignedToMe ? (
          <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-semibold whitespace-nowrap bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
            <CheckCircleIcon className="w-5 h-5" /> Active Match
          </span>
        ) : null}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">Fixed-price</span>
        <span>•</span>
        <span>{postedDaysAgo() || 'Recently'}</span>
        <span>•</span>
        <span className="capitalize">{gig.status || 'open'}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 leading-relaxed">
        {gig.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(gig.skills || []).map(s => (
          <span key={s} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            {s}
          </span>
        ))}
      </div>

      {/* Footer Info: Payment & Client */}
      <div className="mt-auto pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Budget */}
        <div className="flex items-center gap-2">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
            <CurrencyRupeeIcon className="w-5 h-5 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrencyINR(Number(gig.price || gig.budget || 0))}</p>
          </div>
        </div>

        {/* Client details visible on md+ screens */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
             <StarSolidIcon className="w-4 h-4 text-amber-400" /> {clientRating}
             <span className="text-gray-400 dark:text-gray-500 font-normal text-xs ml-1">({clientProjects} projects)</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
             <MapPinIcon className="w-3.5 h-3.5" /> Client: {gig.posted_by_name || 'Verified User'}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          {applied ? (
            <span className="w-full md:w-auto text-center bg-gray-100 dark:bg-gray-800 text-gray-500 py-2.5 px-6 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-gray-400" /> Applied
            </span>
          ) : (!applied && !isAssignedToMe && isOpen) ? (
            <button onClick={handleApply} disabled={applying}
              className="w-full md:w-auto bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow">
              {applying ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Applying…</> : 'Apply'}
            </button>
          ) : (
            <Link to={`/gigs/${gig.id}`} className="w-full md:w-auto text-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  )
})

export default GigCard
