import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarIcon, ClockIcon, UserIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline'

const statusClass = { pending:'badge-pending', confirmed:'badge-confirmed', in_progress:'badge-in_progress', completed:'badge-completed', cancelled:'badge-cancelled' }

export default function BookingCard({ booking }) {
  return (
    <Link to={`/bookings/${booking.id}`} className="card block p-5 hover:border-primary-200 border border-transparent transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={statusClass[booking.status] || 'badge bg-gray-100 text-gray-600'}>{(booking.status||'').replace('_',' ')}</span>
            <span className="text-xs text-gray-400">#{(booking.id||'').slice(-8).toUpperCase()}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{booking.service_title || 'Service Booking'}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4" />{booking.booking_date}</span>
            <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4" />{booking.time_slot}</span>
            <span className="flex items-center gap-1.5 col-span-2"><UserIcon className="w-4 h-4" />{booking.worker_name}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary-600">₹{Number(booking.amount||0).toLocaleString('en-IN')}</p>
          <p className={`text-xs mt-0.5 ${booking.payment_status==='paid'?'text-green-600':'text-yellow-600'}`}>
            {booking.payment_status==='paid'?'Paid':'Payment Pending'}
          </p>
        </div>
      </div>
    </Link>
  )
}
