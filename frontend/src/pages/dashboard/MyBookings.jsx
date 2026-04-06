import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserBookings } from '../../services/firestoreService'
import { BOOKING_STATUSES, formatCurrencyINR } from '../../utils/dummyData'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadBookings()
  }, [user])

  const loadBookings = async () => {
    setLoading(true)
    try {
      setBookings(await getUserBookings(user.uid))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">My Bookings</h1>
          <p className="text-sm text-gray-500">{bookings.length} total bookings</p>
        </div>
        <Link to="/services" className="btn-primary text-sm">Book a Service</Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 font-medium mb-4">No bookings yet</p>
          <Link to="/services" className="btn-primary text-sm">Browse Services</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => {
            const statusConf = BOOKING_STATUSES.find(s => s.key === b.status) || BOOKING_STATUSES[0]
            return (
              <Link key={b.id} to={`/bookings/${b.id}`}
                className="bg-white rounded-xl shadow-card border border-gray-100 p-4 flex items-center justify-between hover:shadow-card-hover transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg">📋</div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm group-hover:text-primary-600">{b.service_title || 'Service'}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{b.booking_date || 'N/A'}</span>
                      <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />{b.time_slot || ''}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConf.color}`}>{statusConf.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrencyINR(b.amount || b.price || 0)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
