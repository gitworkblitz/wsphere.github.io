import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { queryDocuments } from '../../services/firestoreService'
import { dummyJobs, formatCurrencyINR } from '../../utils/dummyData'

export default function MyJobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadJobs()
  }, [user])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const data = await queryDocuments('jobs', 'employer_id', '==', user.uid)
      setJobs(data.length > 0 ? data : dummyJobs.slice(0, 2))
    } catch { setJobs(dummyJobs.slice(0, 2)) }
    finally { setLoading(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="page-header">My Jobs</h1><p className="text-sm text-gray-500">{jobs.length} jobs posted</p></div>
        <Link to="/jobs/create" className="btn-primary text-sm">+ Post Job</Link>
      </div>
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <p className="text-4xl mb-3">💼</p><p className="text-gray-500 font-medium mb-4">No jobs posted yet</p>
          <Link to="/jobs/create" className="btn-primary text-sm">Post Your First Job</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(j => (
            <div key={j.id} className="bg-white rounded-xl shadow-card border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{j.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{j.company} • {j.location} • {j.type}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(j.skills_required || []).slice(0, 4).map(s => (
                      <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <span className={`badge ${j.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {j.is_active !== false ? 'Active' : 'Closed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
