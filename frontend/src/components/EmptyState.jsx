import React from 'react'
import { Link } from 'react-router-dom'

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="text-center py-16 px-6">
      {Icon && <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"><Icon className="w-8 h-8 text-gray-400" /></div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">{description}</p>}
      {actionLabel && (
        actionTo
          ? <Link to={actionTo} className="btn-primary">{actionLabel}</Link>
          : <button onClick={onAction} className="btn-primary">{actionLabel}</button>
      )}
    </div>
  )
}
