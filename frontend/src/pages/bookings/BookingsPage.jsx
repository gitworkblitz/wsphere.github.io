import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserBookings } from '../../services/firestoreService'
import { BOOKING_STATUSES, formatCurrencyINR } from '../../utils/dummyData'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function BookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user) loadBookings()
  }, [user])

  const loadBookings = async () => {
    setLoading(true)
    try {
      setBookings(await getUserBookings(user.uid))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="page-header">My Bookings</h1>
      <p className="page-subtitle">View and manage your service bookings</p>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...BOOKING_STATUSES.map(s => s.key)].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize transition-all ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{f === 'all' ? 'All' : f.replace('_', ' ')}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 font-medium mb-1">No bookings found</p>
          <p className="text-gray-400 text-sm mb-4">Book a service to get started</p>
          <Link to="/services" className="btn-primary text-sm">Browse Services</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => {
            const statusConf = BOOKING_STATUSES.find(s => s.key === b.status) || BOOKING_STATUSES[0]
            return (
              <Link key={b.id} to={`/bookings/${b.id}`}
                className="bg-white rounded-xl shadow-card border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-card-hover transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📋</div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{b.service_title || 'Service'}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" />{b.booking_date || 'N/A'}</span>
                      <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{b.time_slot || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConf.color}`}>{statusConf.label}</span>
                  <span className="font-bold text-gray-900">{formatCurrencyINR(b.amount || b.price || 0)}</span>
                  <span className="text-primary-600 text-sm font-medium">View →</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
