import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { queryDocuments } from '../../services/firestoreService'
import { dummyServices, formatCurrencyINR } from '../../utils/dummyData'
import { StarIcon } from '@heroicons/react/24/solid'

export default function MyServices() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadServices()
  }, [user])

  const loadServices = async () => {
    setLoading(true)
    try {
      const data = await queryDocuments('services', 'worker_id', '==', user.uid)
      setServices(data.length > 0 ? data : dummyServices.slice(0, 2))
    } catch { setServices(dummyServices.slice(0, 2)) }
    finally { setLoading(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">My Services</h1>
          <p className="text-sm text-gray-500">{services.length} services listed</p>
        </div>
        <Link to="/services/create" className="btn-primary text-sm">+ Add Service</Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <p className="text-4xl mb-3">🔧</p>
          <p className="text-gray-500 font-medium mb-4">No services yet</p>
          <Link to="/services/create" className="btn-primary text-sm">Create Your First Service</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s.id} className="bg-white rounded-xl shadow-card border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{s.category}</p>
                </div>
                <span className="text-lg font-bold text-primary-600">{formatCurrencyINR(s.price || 0)}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{s.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{s.rating || 0}</span>
                  <span className="text-xs text-gray-400">({s.total_reviews || 0})</span>
                </div>
                <span className={`badge ${s.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.is_active !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
