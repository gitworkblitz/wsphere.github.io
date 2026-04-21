import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { queryDocumentsLimited } from '../../services/firestoreService'
import { CardGridSkeleton } from '../../components/SkeletonLoader'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'
import {
  Briefcase, Rocket, Clock, CheckCircle, XCircle, ArrowRight, Filter,
  MapPin, DollarSign, Calendar, Star, Building2, Send, Eye, RefreshCw
} from 'lucide-react'

const STATUS_TABS = [
  { key: 'all', label: 'All', icon: Filter },
  { key: 'applied', label: 'Applied', icon: Send, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
  { key: 'shortlisted', label: 'Shortlisted', icon: Star, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' },
]

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', dotColor: 'bg-blue-500', icon: Send },
  shortlisted: { label: 'Shortlisted', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', dotColor: 'bg-amber-500', icon: Star },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', dotColor: 'bg-green-500', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', dotColor: 'bg-red-500', icon: XCircle },
  reviewed: { label: 'Under Review', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', dotColor: 'bg-purple-500', icon: Eye },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } }
}

function ApplicationCard({ app, type }) {
  const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied
  const StatusIcon = status.icon
  const isJob = type === 'job'
  const detailUrl = isJob ? `/jobs/${app.jobId || app.job_id}` : `/gigs/${app.gigId || app.gig_id}`

  const appliedDate = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently'

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -2 }} className="group">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 p-5 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isJob ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 'bg-gradient-to-br from-orange-500 to-red-500'} shadow-sm`}>
              {isJob ? <Briefcase className="w-5 h-5 text-white" /> : <Rocket className="w-5 h-5 text-white" />}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isJob ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                {isJob ? 'Job' : 'Gig'}
              </span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${status.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
            {status.label}
          </span>
        </div>

        {/* Title & Company */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
          {app.jobTitle || app.gigTitle || app.title || 'Untitled Position'}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span className="truncate">{app.company || app.companyName || app.posted_by_name || 'Company'}</span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-4">
          {(app.location || app.jobLocation) && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {app.location || app.jobLocation}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Applied {appliedDate}
          </span>
          {(app.salary || app.budget) && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              ₹{((app.salary || app.budget) / 1000).toFixed(0)}k
            </span>
          )}
        </div>

        {/* Cover Letter Preview */}
        {app.coverLetter && (
          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mb-3 italic">
            "{app.coverLetter}"
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
          <Link
            to={detailUrl}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium flex items-center gap-1 group/link"
          >
            View {isJob ? 'Job' : 'Gig'}
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
          {app.status === 'accepted' && (
            <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium">
              🎉 Congratulations!
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function MyApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const loadApplications = useCallback(async (showRefresh = false) => {
    if (!user) return
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const [jobApps, gigApps] = await Promise.all([
        queryDocumentsLimited('job_applications', 'userId', '==', user.uid, 100).catch(() => []),
        queryDocumentsLimited('gig_applications', 'userId', '==', user.uid, 100).catch(() => []),
      ])

      const combined = [
        ...jobApps.map(a => ({ ...a, _type: 'job' })),
        ...gigApps.map(a => ({ ...a, _type: 'gig' })),
      ].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
        return dateB - dateA
      })

      setApplications(combined)
    } catch (err) {
      console.error('Error loading applications:', err)
      setError('Failed to load applications')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  const filtered = useMemo(() => {
    if (activeTab === 'all') return applications
    return applications.filter(a => a.status === activeTab)
  }, [applications, activeTab])

  const counts = useMemo(() => {
    const c = { all: applications.length, applied: 0, shortlisted: 0, accepted: 0, rejected: 0 }
    applications.forEach(a => {
      if (c[a.status] !== undefined) c[a.status]++
    })
    return c
  }, [applications])

  if (loading) return <CardGridSkeleton count={6} type="job" />

  if (error) return (
    <div className="p-6 max-w-6xl mx-auto">
      <ErrorState title="Failed to load applications" message={error} onRetry={() => loadApplications()} />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Track all your job and gig applications
          </p>
        </div>
        <button
          onClick={() => loadApplications(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', count: counts.all, gradient: 'from-blue-500 to-indigo-600', icon: Briefcase },
          { label: 'Applied', count: counts.applied, gradient: 'from-amber-500 to-orange-500', icon: Send },
          { label: 'Shortlisted', count: counts.shortlisted, gradient: 'from-emerald-500 to-green-600', icon: Star },
          { label: 'Accepted', count: counts.accepted, gradient: 'from-green-500 to-teal-600', icon: CheckCircle },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.gradient} shadow-sm mb-2`}>
              <item.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{item.count}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-primary-900/30'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              {counts[tab.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {filtered.length} application{filtered.length !== 1 ? 's' : ''} found
      </p>

      {filtered.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(app => (
              <ApplicationCard key={app.id} app={app} type={app._type} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No applications found"
          description={activeTab !== 'all' ? `No ${activeTab} applications yet.` : "You haven't applied to any jobs or gigs yet."}
          actionLabel="Browse Jobs"
          actionTo="/jobs"
        />
      )}
    </div>
  )
}
