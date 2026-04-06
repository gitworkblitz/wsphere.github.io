import React from 'react'
import { Link } from 'react-router-dom'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export default function InvoiceCard({ invoice }) {
  const amount = invoice.amount || {}
  return (
    <div className="card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{invoice.invoice_number}</p>
            <p className="text-sm text-gray-500 mt-0.5">{invoice.service_details?.title || 'Service'}</p>
            <p className="text-xs text-gray-400 mt-0.5">{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('en-IN') : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">₹{Number(amount.total||0).toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400">incl. 18% GST</p>
          </div>
          <Link to={`/invoices/${invoice.id}`} className="btn-primary text-sm px-3 py-1.5">View</Link>
        </div>
      </div>
    </div>
  )
}
