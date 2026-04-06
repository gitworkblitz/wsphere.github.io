import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { applyToJob, hasUserApplied } from '../services/firestoreService'
import { formatSalaryRange } from '../utils/dummyData'
import { MapPinIcon, BriefcaseIcon, ClockIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

export default function JobCard({ job }) {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)

  const handleApply = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { navigate('/login'); return }

    setApplying(true)
    try {
      await applyToJob({
        jobId: job.id,
        userId: user.uid,
        userName: userProfile?.name || 'User',
        userEmail: user.email || '',
      })
      setApplied(true)
      toast.success('Application submitted successfully!')
    } catch (err) {
      if (err.message?.includes('already applied')) {
        setApplied(true)
        toast.error('You have already applied to this job')
      } else {
        toast.error(err.message || 'Failed to apply')
      }
    } finally { setApplying(false) }
  }

  const postedDaysAgo = () => {
    if (!job.createdAt) return ''
    const days = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card border border-gray-100 dark:border-gray-800 p-5 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 flex flex-col group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job.id}`} className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</Link>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-0.5">{job.company}</p>
        </div>
        <span className="ml-3 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 capitalize bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {(job.employment_type || job.type || 'full_time').replace(/_/g, ' ')}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" />{job.location}</span>
        <span className="flex items-center gap-1"><BriefcaseIcon className="w-3.5 h-3.5" />{formatSalaryRange(job.salary_min || 0, job.salary_max || 0)}</span>
        {postedDaysAgo() && <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{postedDaysAgo()}</span>}
      </div>

      {job.description && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{job.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(job.skills_required || []).slice(0, 4).map(s => (
          <span key={s} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        {job.applications_count !== undefined && (
          <span className="text-xs text-gray-400 dark:text-gray-500">{job.applications_count} applicant{job.applications_count !== 1 ? 's' : ''}</span>
        )}
        {applied ? (
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
            <CheckCircleIcon className="w-4 h-4" /> Applied
          </span>
        ) : (
          <button onClick={handleApply} disabled={applying}
            className="ml-auto bg-primary-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
            {applying ? 'Applying…' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  )
}
