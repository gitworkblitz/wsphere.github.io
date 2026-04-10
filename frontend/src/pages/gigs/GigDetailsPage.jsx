import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getGigById, applyToGig, hasUserAppliedToGig, completeGig } from '../../services/firestoreService'
import { dummyGigs, formatCurrencyINR } from '../../utils/dummyData'
import { ClockIcon, MapPinIcon, ArrowLeftIcon, CalendarDaysIcon, UserIcon, IdentificationIcon, ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { StarIcon, CheckCircleIcon, ExclamationTriangleIcon, CurrencyRupeeIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import { DetailSkeleton } from '../../components/SkeletonLoader'

const STATUS_BADGE = {
  open: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
}

export default function GigDetailsPage() {
  const { id } = useParams()
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => { loadGig() }, [id])

  useEffect(() => {
    if (user && gig?.id) {
      hasUserAppliedToGig(gig.id, user.uid).then(setApplied).catch(console.error)
    }
  }, [user, gig?.id])

  const loadGig = async () => {
    // 1. Instant Cache
    const cached = dummyGigs.find(g => g.id === id)
    if (cached) {
      setGig({ ...cached, status: cached.status || 'open' })
      setLoading(false)
    } else {
      setLoading(true)
    }

    try {
      let data = await getGigById(id)
      if (data) {
        if (!data.status) data.status = 'open'
        setGig(data)
      } else if (!cached) {
        toast.error('Gig not found')
        navigate('/gigs')
      }
    } catch (err) {
      console.error('Error loading gig:', err)
      if (!cached) { toast.error('Failed to load gig'); navigate('/gigs') }
    } finally { if (!cached) setLoading(false) }
  }

  const handleApplyGig = async () => {
    if (!user) { navigate('/login'); return }
    if (applied) return

    try {
      setActionLoading(true)
      await applyToGig({
        gigId: gig.id,
        userId: user.uid,
        userName: userProfile?.name || 'User',
        applicantName: userProfile?.name || 'User',
        userEmail: user.email || '',
        gigTitle: gig.title || '',
        employerId: gig.employer_id || gig.posted_by || '',
      })
      toast.success('Applied Successfully ✅')
      setApplied(true)
    } catch (e) {
      console.error('Apply gig error:', e)
      if (e.message?.includes('already applied')) {
        setApplied(true)
        toast.error('You have already applied to this gig')
      } else {
        toast.error(e.message || 'Failed to apply to gig')
      }
    } finally { setActionLoading(false) }
  }

  const handleCompleteGig = async () => {
    if (!user) return
    try {
      setActionLoading(true)
      await completeGig(id, user.uid)
      toast.success('Gig marked as completed!')
      await loadGig()
    } catch (e) {
      console.error('Complete gig error:', e)
      toast.error(e.message || 'Failed to complete gig')
    } finally { setActionLoading(false) }
  }

  if (loading) return <DetailSkeleton />
  if (!gig) return null

  const isOwner = user && (gig.employer_id === user.uid || gig.freelancer_id === user.uid)
  const isAssigned = user && gig.assignedTo === user.uid
  const isTaken = gig.assignedTo && (!user || gig.assignedTo !== user.uid)

  const postedDaysAgo = () => {
    if (!gig.createdAt) return ''
    const days = Math.floor((Date.now() - new Date(gig.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Posted today'
    if (days === 1) return 'Posted 1 day ago'
    return `Posted ${days} days ago`
  }

  const client = gig.client_details || { rating: 4.5, projects_posted: 0, member_since: '2023' }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/gigs" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors font-medium">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Gigs
        </Link>

        {/* Upwork style layout: Left column (main content) + Right column (Apply/Client info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase px-3 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                  {gig.category || 'General Category'}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_BADGE[gig.status] || STATUS_BADGE.open}`}>
                  {(gig.status || 'open').replace('-', ' ')}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2">{gig.title}</h1>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                <span className="flex items-center gap-1.5 font-medium"><MapPinIcon className="w-4 h-4" /> {gig.location || 'Remote'}</span>
                <span className="flex items-center gap-1.5 font-medium"><ClockIcon className="w-4 h-4" /> {postedDaysAgo()}</span>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><DocumentTextIcon className="w-5 h-5 text-gray-400" /> Project Description</h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{gig.description}</div>
              </div>

              {/* Grid of Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium flex items-center gap-1"><CurrencyRupeeIcon className="w-4 h-4" /> Budget</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrencyINR(Number(gig.price || gig.budget || 0))}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Fixed-price</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium flex items-center gap-1"><ClockIcon className="w-4 h-4" /> Duration</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{gig.duration || 'Not specified'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Estimated time</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium flex items-center gap-1"><CalendarDaysIcon className="w-4 h-4" /> Deadline</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{gig.deadline || 'Negotiable'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Target date</p>
                  </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Skills and Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {(gig.skills||[]).map(s => (
                    <span key={s} className="bg-gray-100 dark:bg-gray-800 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-default">
                      {s}
                    </span>
                  ))}
                  {(gig.skills||[]).length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm italic">No specific skills listed.</p>}
                </div>
              </div>
            </div>
            
            {/* Project Status Banner (Assigned/Completed) */}
            {gig.assignedTo && (
              <div className={`rounded-2xl p-6 border-l-4 shadow-sm flex items-start gap-4 ${gig.status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'}`}>
                {gig.status === 'completed' ? <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-500 mt-0.5" /> : <ClockIcon className="w-8 h-8 text-blue-600 dark:text-blue-500 mt-0.5" />}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                    {gig.status === 'completed' ? 'Project Completed' : 'Project In Progress'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Assigned to: <strong className="text-gray-900 dark:text-white">{gig.assignedName || 'Unknown'}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Action Box */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              
              {applied ? (
                <div className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold py-3.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 mb-4 cursor-not-allowed">
                  <CheckCircleIcon className="w-5 h-5 text-gray-400" /> Applied
                </div>
              ) : gig.status === 'open' && !isOwner && !isTaken && (
                <>
                  <button onClick={handleApplyGig} disabled={actionLoading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 mb-4">
                    {actionLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Applying…</> : 'Apply'}
                  </button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 flex justify-center items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-green-500" /> Secure payment via WorkSphere</p>
                </>
              )}

              {gig.status === 'open' && isOwner && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center">
                  <IdentificationIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-bold text-gray-900 dark:text-white mb-1">This is your gig</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Waiting for proposals</p>
                </div>
              )}

              {isTaken && gig.status === 'in-progress' && !isAssigned && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 text-center">
                  <ExclamationTriangleIcon className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold text-amber-800 dark:text-amber-400 mb-1">Position Filled</p>
                  <p className="text-sm text-amber-700 dark:text-amber-500">This gig is currently being worked on.</p>
                </div>
              )}

              {isAssigned && gig.status === 'in-progress' && (
                <button onClick={handleCompleteGig} disabled={actionLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                  {actionLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Completing…</> : 'Submit Final Work'}
                </button>
              )}

              {gig.status === 'completed' && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center">
                  <CheckCircleIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-bold text-gray-900 dark:text-white">Gig Closed</p>
                </div>
              )}
            </div>

            {/* Client Info Box */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">About the client</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {(gig.freelancer_name || gig.posted_by_name || 'C')[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">{gig.freelancer_name || gig.posted_by_name || 'Client Name'}</p>
                    <div className="flex items-center gap-1 mb-1">
                      <StarIcon className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{client.rating}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">of 5 reviews</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 pb-2">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Location</h4>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{gig.location || 'India'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">History</h4>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{client.projects_posted} jobs posted</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Member Since</h4>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{client.member_since}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
