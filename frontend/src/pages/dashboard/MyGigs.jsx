import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { queryDocuments } from '../../services/firestoreService'
import { dummyGigs, formatCurrencyINR } from '../../utils/dummyData'

export default function MyGigs() {
  const { user } = useAuth()
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadGigs()
  }, [user])

  const loadGigs = async () => {
    setLoading(true)
    try {
      const data = await queryDocuments('gigs', 'employer_id', '==', user.uid)
      setGigs(data.length > 0 ? data : dummyGigs.slice(0, 2))
    } catch { setGigs(dummyGigs.slice(0, 2)) }
    finally { setLoading(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="page-header">My Gigs</h1><p className="text-sm text-gray-500">{gigs.length} gigs posted</p></div>
        <Link to="/gigs/create" className="btn-primary text-sm">+ Post Gig</Link>
      </div>
      {gigs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <p className="text-4xl mb-3">🚀</p><p className="text-gray-500 font-medium mb-4">No gigs posted yet</p>
          <Link to="/gigs/create" className="btn-primary text-sm">Post Your First Gig</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {gigs.map(g => (
            <div key={g.id} className="bg-white rounded-xl shadow-card border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{g.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{g.category} • {g.location}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(g.skills || []).slice(0, 4).map(s => (
                      <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{formatCurrencyINR(g.budget || 0)}</p>
                  <span className={`badge mt-1 ${g.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {g.status || 'active'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
