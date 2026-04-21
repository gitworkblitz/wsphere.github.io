import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getJobById, getJobApplications, updateApplicationStatus } from '../../services/firestoreService'
import { dummyJobs } from '../../utils/dummyData'
import { TableSkeleton } from '../../components/SkeletonLoader'
import toast from 'react-hot-toast'
import {
  UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon,
  CheckCircleIcon, XCircleIcon, DocumentArrowDownIcon,
  AcademicCapIcon, WrenchIcon, MagnifyingGlassIcon,
  ArrowLeftIcon, FunnelIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid, CheckBadgeIcon } from '@heroicons/react/24/solid'

export default function JobApplicantsPage() {
  const { id } = useParams()
  const { userProfile } = useAuth()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      let jobData = await getJobById(id)
      if (!jobData) jobData = dummyJobs.find(j => j.id === id)
      setJob(jobData)

      const apps = await getJobApplications(id)
      setApplications(apps)
    } catch (err) {
      console.error('Error loading applicants:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (appId, status) => {
    setActionLoading(appId)
    try {
      await updateApplicationStatus(appId, status)
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
      toast.success(`Application ${status}`)
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setActionLoading(null)
    }
  }

  const statusCounts = useMemo(() => ({
    all: applications.length,
    applied: applications.filter(a => !a.status || a.status === 'applied').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }), [applications])

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchSearch = !search ||
        (app.name || app.applicantName || '').toLowerCase().includes(search.toLowerCase()) ||
        (app.email || app.applicantEmail || '').toLowerCase().includes(search.toLowerCase()) ||
        (app.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
      const matchStatus = statusFilter === 'all' ||
        (statusFilter === 'applied' && (!app.status || app.status === 'applied')) ||
        app.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [applications, search, statusFilter])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
      case 'reviewed': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
      case 'shortlisted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800'
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
    }
  }

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><TableSkeleton rows={5} /></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/dashboard/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to My Jobs
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Applicants</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{job?.title} — <span className="text-primary-600 dark:text-primary-400 font-medium">{job?.company}</span></p>
            </div>
            <Link to={`/jobs/${id}`} className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium flex items-center gap-1">
              View Job Posting →
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: statusCounts.all, color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300', dot: 'bg-gray-500', filter: 'all' },
            { label: 'Applied', count: statusCounts.applied, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300', dot: 'bg-blue-500', filter: 'applied' },
            { label: 'Shortlisted', count: statusCounts.shortlisted, color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300', dot: 'bg-green-500', filter: 'shortlisted' },
            { label: 'Rejected', count: statusCounts.rejected, color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300', dot: 'bg-red-500', filter: 'rejected' },
          ].map(({ label, count, color, dot, filter }) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`p-4 rounded-xl text-center transition-all border-2 ${
                statusFilter === filter ? 'border-primary-400 dark:border-primary-600 shadow-md' : 'border-transparent'
              } ${color}`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-2xl font-bold">{count}</span>
              </div>
              <p className="text-xs font-medium opacity-70">{label}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or skill…"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Results */}
        {filteredApps.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
            <UserCircleIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {applications.length === 0 ? 'No Applicants Yet' : 'No matches found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {applications.length === 0
                ? "You haven't received any applications for this job yet."
                : "Try a different search or filter."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Showing <span className="text-gray-900 dark:text-white font-bold">{filteredApps.length}</span> applicant{filteredApps.length !== 1 ? 's' : ''}
            </p>

            {filteredApps.map((app) => (
              <div key={app.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                      {(app.name || app.applicantName)?.[0]?.toUpperCase() || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + Resume */}
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{app.name || app.applicantName}</h3>
                        {app.resumeURL && (
                          <a
                            href={app.resumeURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 dark:border-primary-800"
                          >
                            <DocumentArrowDownIcon className="w-3.5 h-3.5" /> Resume
                          </a>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {(app.email || app.applicantEmail) && (
                          <span className="flex items-center gap-1">
                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                            {app.email || app.applicantEmail}
                          </span>
                        )}
                        {app.phone && (
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                            {app.phone}
                          </span>
                        )}
                        {app.location && (
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                            {app.location}
                          </span>
                        )}
                        {app.experience !== undefined && (
                          <span className="flex items-center gap-1">
                            <AcademicCapIcon className="w-4 h-4 text-gray-400" />
                            {app.experience} Years Exp.
                          </span>
                        )}
                      </div>

                      {/* Skills */}
                      {app.skills && app.skills.length > 0 && (
                        <div className="flex items-start gap-2 mb-3">
                          <WrenchIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="flex flex-wrap gap-1.5">
                            {app.skills.map((skill, idx) => (
                              <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-0.5 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cover Letter */}
                      {app.coverLetter && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap line-clamp-3">{app.coverLetter}</p>
                        </div>
                      )}

                      {/* Status + Date */}
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(app.status || 'applied')}`}>
                          {app.status || 'applied'}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Applied {app.appliedAt || app.createdAt ? new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'recently'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0 ml-4">
                    {(!app.status || app.status === 'applied') && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                          disabled={actionLoading === app.id}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium border border-green-200 dark:border-green-800 disabled:opacity-50"
                          title="Shortlist"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          disabled={actionLoading === app.id}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium border border-red-200 dark:border-red-800 disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {app.status === 'shortlisted' && (
                      <div className="flex flex-col items-center gap-2">
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                          <CheckBadgeIcon className="w-5 h-5" /> Shortlisted
                        </span>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          disabled={actionLoading === app.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-xs font-medium border border-red-200 dark:border-red-800 disabled:opacity-50"
                        >
                          <XCircleIcon className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    )}
                    {app.status === 'rejected' && (
                      <span className="text-red-500 dark:text-red-400 text-sm font-medium flex items-center gap-1">
                        <XCircleIcon className="w-5 h-5" /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
