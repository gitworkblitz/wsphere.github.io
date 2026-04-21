import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatSalaryRange } from '../utils/dummyData'
import { MapPinIcon, ClockIcon, CurrencyRupeeIcon, AcademicCapIcon, BriefcaseIcon, BookmarkIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid, BookmarkIcon as BookmarkSolid, FireIcon } from '@heroicons/react/24/solid'

const MAX_VISIBLE_SKILLS = 3

const JobCard = React.memo(function JobCard({ job, featured = false, compact = false }) {

  const [saved, setSaved] = useState(false)

  const postedDaysAgo = () => {
    if (!job.createdAt) return 'Recently posted'
    const days = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Posted today'
    if (days === 1) return '1 day ago'
    if (days <= 7) return `${days} days ago`
    return `${Math.ceil(days / 7)} weeks ago`
  }

  const isNew = () => {
    if (!job.createdAt) return false
    const days = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    return days <= 2
  }

  const isHot = () => {
    return (job.salary_max || 0) >= 1000000 || featured
  }

  const getLogoColor = (name) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-emerald-500 to-emerald-600',
      'from-violet-500 to-violet-600',
      'from-rose-500 to-rose-600',
      'from-amber-500 to-amber-600',
      'from-cyan-500 to-cyan-600',
      'from-indigo-500 to-indigo-600',
    ]
    let hash = 0
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  const logoColorClass = getLogoColor(job.company)
  const initials = (job.company || 'C').substring(0, 2).toUpperCase()
  const typeLabel = (job.employment_type || job.type || 'full_time').replace(/_/g, ' ')

  const typeBadgeColor = {
    internship: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800',
    part_time: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
    contract: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
    remote: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800',
  }
  const badgeClass = typeBadgeColor[job.employment_type] || 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'

  const handleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setSaved(!saved)
  }

  const skills = job.skills_required || []
  const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS)
  const hiddenSkillCount = skills.length - MAX_VISIBLE_SKILLS

  return (
    <Link
      to={`/jobs/${job.id}`}
      id={`job-card-${job.id}`}
      className={`block h-full group relative ${featured ? 'ring-2 ring-primary-500/40' : ''}`}
    >
      <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 h-full flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative`}>

        {/* Featured top accent bar */}
        {featured && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-indigo-500 to-violet-500" />
        )}

        {/* ===== ROW 1: Header — Logo + Title + Badges ===== */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Left: Logo + Title */}
          <div className="flex gap-3 items-start flex-1 min-w-0">
            <div className={`w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm bg-gradient-to-br ${logoColorClass} text-white`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
                {job.title}
              </h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-0.5 truncate">{job.company}</p>
            </div>
          </div>

          {/* Right: Badges + Bookmark */}
          <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            {isNew() && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">
                NEW
              </span>
            )}
            {isHot() && !featured && (
              <span className="flex items-center gap-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                <FireIcon className="w-3 h-3" /> HOT
              </span>
            )}
            {featured && (
              <span className="flex items-center gap-0.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                <StarSolid className="w-3 h-3" /> FEATURED
              </span>
            )}
            <button
              onClick={handleSave}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={saved ? 'Unsave' : 'Save job'}
            >
              {saved ? (
                <BookmarkSolid className="w-[18px] h-[18px] text-primary-600" />
              ) : (
                <BookmarkIcon className="w-[18px] h-[18px] text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* ===== ROW 2: Description (non-compact only) ===== */}
        {!compact && job.description && (
          <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {job.description}
          </p>
        )}

        {/* ===== ROW 3: Location + Posted ===== */}
        <div className="flex items-center text-[13px] text-gray-500 dark:text-gray-400 mb-3 gap-3">
          <span className="flex items-center gap-1 truncate">
            <MapPinIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">|</span>
          <span className="flex items-center gap-1 truncate">
            <ClockIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{postedDaysAgo()}</span>
          </span>
        </div>

        {/* ===== ROW 4: Salary + Experience (2-col grid) ===== */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-2.5 border border-gray-100 dark:border-gray-700/50">
            <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-0.5 uppercase tracking-wide font-medium">
              <CurrencyRupeeIcon className="w-3 h-3" /> Salary
            </span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block truncate">{formatSalaryRange(job.salary_min || 0, job.salary_max || 0)}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-2.5 border border-gray-100 dark:border-gray-700/50">
            <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-0.5 uppercase tracking-wide font-medium">
              <AcademicCapIcon className="w-3 h-3" /> Experience
            </span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block truncate">{job.experience_required || 'Open'}</span>
          </div>
        </div>

        {/* ===== ROW 5: Skills tags ===== */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[28px]">
          {visibleSkills.map(s => (
            <span key={s} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-md font-medium">{s}</span>
          ))}
          {hiddenSkillCount > 0 && (
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs px-2 py-1 rounded-md font-medium">+{hiddenSkillCount} more</span>
          )}
        </div>

        {/* ===== ROW 6 (BOTTOM): Type badges + View & Apply button — pinned to bottom ===== */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
          {/* Left: Type badges */}
          <div className="flex items-center gap-1.5 flex-shrink min-w-0 overflow-hidden">
            <span className={`text-[10px] font-bold px-2.5 py-[5px] rounded-md border uppercase tracking-wide whitespace-nowrap ${badgeClass}`}>
              {typeLabel}
            </span>
            {(job.location === 'Remote' || job.employment_type === 'remote') && job.employment_type !== 'remote' && (
              <span className="text-[10px] font-bold px-2 py-[5px] rounded-md bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800 uppercase tracking-wide whitespace-nowrap">
                Remote
              </span>
            )}
          </div>

          {/* Right: CTA button */}
          <span
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white text-[13px] font-semibold px-4 py-[7px] rounded-lg group-hover:from-primary-700 group-hover:to-primary-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm group-hover:shadow-md flex-shrink-0"
          >
            <BriefcaseIcon className="w-3.5 h-3.5" />
            View & Apply
          </span>
        </div>
      </div>
    </Link>
  )
})

export default JobCard
