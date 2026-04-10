import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getJobById, applyToJob, hasUserApplied } from '../../services/firestoreService'
import { dummyJobs, formatSalaryRange } from '../../utils/dummyData'
import { MapPinIcon, CalendarIcon, BriefcaseIcon, CurrencyRupeeIcon, AcademicCapIcon, BuildingOfficeIcon, UserIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import { DetailSkeleton } from '../../components/SkeletonLoader'

export default function JobDetailsPage() {
  const { id } = useParams()
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')

  useEffect(() => {
    loadJob()
  }, [id])

  const loadJob = async () => {
    setLoading(true)
    try {
      // Try Firestore first
      let data = await getJobById(id)
      // Fallback to dummy data
      if (!data) {
        data = dummyJobs.find(j => j.id === id)
      }
      if (!data) {
        toast.error('Job not found')
        navigate('/jobs')
        return
      }
      setJob(data)

      // Check if user already applied
      if (user) {
        const alreadyApplied = await hasUserApplied(id, user.uid)
        setApplied(alreadyApplied)
      }
    } catch (err) {
      console.error('Error loading job:', err)
      // Try dummy data as last resort
      const dummy = dummyJobs.find(j => j.id === id)
      if (dummy) {
        setJob(dummy)
      } else {
        toast.error('Failed to load job')
        navigate('/jobs')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!user) { navigate('/login'); return }
    try {
      setApplying(true)
      await applyToJob({
        jobId: id,
        userId: user.uid,
        applicantName: userProfile?.name || user.displayName || user.email,
        applicantEmail: user.email,
        applicantPhone: userProfile?.phone || '',
        coverLetter: coverLetter,
        jobTitle: job.title,
        company: job.company,
        employerId: job.employer_id || job.posted_by,
        location: userProfile?.location || '',
      })
      toast.success('Applied Successfully ✅')
      setApplied(true)
      setShowForm(false)
    } catch (e) {
      console.error('Apply error:', e)
      if (e.message.includes('already applied')) {
        toast.error('You have already applied to this job')
        setApplied(true)
      } else {
        toast.error(e.message || 'Failed to submit application')
      }
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <DetailSkeleton />
  if (!job) return null

  const isEmployer = user && (job.employer_id === user.uid || userProfile?.user_type === 'employer')

  const getLogoColor = (name) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-violet-100 text-violet-600', 'bg-rose-100 text-rose-600', 'bg-amber-100 text-amber-600']
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  const logoColorClass = getLogoColor(job.company)
  const initials = (job.company || 'C').substring(0, 1).toUpperCase()

  const postedDaysAgo = () => {
    if (!job.createdAt) return ''
    const days = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Posted today'
    if (days === 1) return 'Posted 1 day ago'
    return `Posted ${days} days ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Jobs
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between mb-8">
            <div className="flex gap-4 items-start">
              <div className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-2xl shadow-sm border border-white/20 ${logoColorClass}`}>
                {job.company_logo ? <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover rounded-xl" /> : initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">{job.title}</h1>
                <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-1">{job.company}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPinIcon className="w-4 h-4" /> {job.location}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col md:items-end">
              {applied ? (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-6 py-2.5 rounded-xl font-semibold">
                  <CheckCircleIcon className="w-5 h-5" /> Applied
                </div>
              ) : !showForm ? (
                <button onClick={() => user ? setShowForm(true) : navigate('/login')} className="bg-primary-600 text-white font-semibold shadow-sm hover:shadow-md hover:bg-primary-700 px-8 py-2.5 rounded-xl transition-all">
                  Apply Now
                </button>
              ) : null}
              {isEmployer && (
                <Link to={`/jobs/${id}/applicants`} className="inline-flex items-center gap-2 mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
                  <UserIcon className="w-4 h-4" /> View Applicants
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-8 border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1"><CurrencyRupeeIcon className="w-4 h-4" /> Salary / Stipend</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{formatSalaryRange(job.salary_min || 0, job.salary_max || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1"><AcademicCapIcon className="w-4 h-4" /> Experience</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{job.experience_required || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1"><BriefcaseIcon className="w-4 h-4" /> Job Type</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{(job.employment_type || job.type || '').replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1"><ClockIcon className="w-4 h-4" /> Posted</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{postedDaysAgo()}</p>
            </div>
          </div>

          <div className="space-y-8">
            {job.description && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white items-center gap-2 mb-3">Job Description</h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</div>
              </section>
            )}

            {(job.responsibilities || []).length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Key Responsibilities</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="leading-relaxed">{r}</li>
                  ))}
                </ul>
              </section>
            )}

            {(job.skills_required || []).length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map(s => (
                    <span key={s} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {(job.perks || []).length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Perks & Benefits</h2>
                <div className="flex flex-wrap gap-2">
                  {job.perks.map(p => (
                    <span key={p} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-md text-sm border border-green-100 dark:border-green-800/50">{p}</span>
                  ))}
                </div>
              </section>
            )}

            {job.about_company && (
              <section className="bg-gray-50 dark:bg-gray-800/50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 mt-8 border-t border-gray-100 dark:border-gray-800 rounded-b-2xl">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><BuildingOfficeIcon className="w-5 h-5" /> About {job.company}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{job.about_company}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Location: <span className="font-medium text-gray-700 dark:text-gray-300">{job.location}</span></p>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Application form */}
        {showForm && !applied && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Submit Application</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Letter (optional)</label>
              <textarea 
                value={coverLetter} 
                onChange={e => setCoverLetter(e.target.value)} 
                rows={5} 
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400" 
                placeholder="Tell the employer why you're a great fit…" 
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium px-6 py-3 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleApply} disabled={applying} className="flex-1 bg-primary-600 text-white font-semibold hover:bg-primary-700 px-6 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                {applying ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                ) : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
