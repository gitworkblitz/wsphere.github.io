import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { applyToJob, hasUserApplied } from '../services/firestoreService'
import { formatSalaryRange } from '../utils/dummyData'
import { MapPinIcon, BriefcaseIcon, ClockIcon, CurrencyRupeeIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

const JobCard = React.memo(function JobCard({ job }) {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (user && job?.id) {
      hasUserApplied(job.id, user.uid).then(setApplied).catch(console.error)
    }
  }, [user, job?.id])

  const handleApply = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (applied) return

    setApplying(true)
    try {
      await applyToJob({
        jobId: job.id,
        userId: user.uid,
        userName: userProfile?.name || 'User',
        applicantName: userProfile?.name || 'User',
        userEmail: user.email || '',
        jobTitle: job.title || '',
        employerId: job.employer_id || job.posted_by || '',
      })
      setApplied(true)
      toast.success('Applied Successfully ✅')
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

  const getLogoColor = (name) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-violet-100 text-violet-600', 'bg-rose-100 text-rose-600', 'bg-amber-100 text-amber-600']
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  const logoColorClass = getLogoColor(job.company)
  const initials = (job.company || 'C').substring(0, 1).toUpperCase()

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card border border-gray-100 dark:border-gray-800 p-5 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 flex flex-col group">
      <div className="flex gap-4 items-start mb-4">
        <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xl ${logoColorClass}`}>
          {job.company_logo ? <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover rounded-lg" /> : initials}
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job.id}`} className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">
            {job.title}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium flex items-center gap-1">
            {job.company}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {(job.employment_type || job.type || 'full_time').replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4 gap-1">
        <MapPinIcon className="w-4 h-4 text-gray-400" /> {job.location}
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><CurrencyRupeeIcon className="w-3.5 h-3.5" /> Salary / Stipend</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatSalaryRange(job.salary_min || 0, job.salary_max || 0)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><AcademicCapIcon className="w-3.5 h-3.5" /> Experience</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{job.experience_required || 'Not specified'}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(job.skills_required || []).slice(0, 4).map(s => (
          <span key={s} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-md">{s}</span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-md">
          <ClockIcon className="w-3.5 h-3.5" /> {postedDaysAgo() || 'Recently'}
        </span>
        
        {applied ? (
          <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg">
            <CheckCircleIcon className="w-4 h-4" /> Applied
          </span>
        ) : (
          <button onClick={handleApply} disabled={applying}
            className="bg-primary-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 min-w-[100px] shadow-sm hover:shadow-md">
            {applying ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Applying…</> : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  )
})

export default JobCard
