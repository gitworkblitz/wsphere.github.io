import React, { useEffect } from 'react'
import { formatCurrencyINR } from '../utils/dummyData'
import {
  CurrencyRupeeIcon, ShieldCheckIcon, XMarkIcon,
  CheckCircleIcon, LockClosedIcon
} from '@heroicons/react/24/outline'

/**
 * PaymentModal – dummy payment confirmation dialog.
 * Props:
 *   amount    (number)   – amount in INR
 *   service   (string)   – service title
 *   worker    (string)   – worker name
 *   date      (string)   – booking date
 *   loading   (boolean)  – spinner state
 *   onConfirm ()         – callback when user confirms payment
 *   onClose   ()         – callback to close modal
 */
export default function PaymentModal({ amount, service, worker, date, loading, onConfirm, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && !loading) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [loading, onClose])

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const tax = Math.round(amount * 0.18)
  const total = amount + tax

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CurrencyRupeeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Confirm Payment</h2>
              <p className="text-green-100 text-xs">Secure checkout powered by WorkSphere</p>
            </div>
          </div>
          {!loading && (
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Order summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Service</span>
                <span className="font-semibold text-gray-900 dark:text-white">{service || 'Service Booking'}</span>
              </div>
              {worker && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Provider</span>
                  <span className="font-medium text-gray-900 dark:text-white">{worker}</span>
                </div>
              )}
              {date && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">{date}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatCurrencyINR(amount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">GST (18%)</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatCurrencyINR(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-green-600 dark:text-green-400">{formatCurrencyINR(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dummy card display */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 mb-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <LockClosedIcon className="w-4 h-4 text-gray-400" />
              <div className="flex gap-1">
                <div className="w-6 h-4 bg-white/20 rounded" />
                <div className="w-6 h-4 bg-white/20 rounded" />
              </div>
            </div>
            <p className="font-mono text-sm tracking-widest text-white/80">•••• •••• •••• 4242</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400">Test Card (Demo)</p>
              <p className="text-xs text-gray-400">12/28</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-5">
            <ShieldCheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>256-bit SSL encryption • PCI DSS Compliant • WorkSphere Secure Pay</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Pay {formatCurrencyINR(total)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
