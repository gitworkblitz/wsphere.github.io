import React, { useState, useEffect, useCallback } from 'react'
import { getRecentDocuments, updateDocument, deleteDocument } from '../../services/firestoreService'
import { DashboardSkeleton } from '../../components/SkeletonLoader'
import ErrorState from '../../components/ErrorState'
import {
  Mail, Clock, User, Trash2, CheckCircle, Eye, RefreshCw, MessageSquare, Search
} from 'lucide-react'

export default function ManageContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const loadContacts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRecentDocuments('contacts', 100)
      setContacts(data)
    } catch (err) {
      console.error('Error loading contacts:', err)
      setError('Failed to load contact messages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadContacts() }, [loadContacts])

  const handleMarkRead = async (id) => {
    try {
      await updateDocument('contacts', id, { status: 'read' })
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'read' } : c))
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact message?')) return
    try {
      await deleteDocument('contacts', id)
      setContacts(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting contact:', err)
    }
  }

  const filtered = contacts.filter(c => {
    if (filter === 'unread' && c.status === 'read') return false
    if (filter === 'read' && c.status !== 'read') return false
    if (search) {
      const q = search.toLowerCase()
      return (c.name || '').toLowerCase().includes(q) ||
             (c.email || '').toLowerCase().includes(q) ||
             (c.subject || '').toLowerCase().includes(q) ||
             (c.message || '').toLowerCase().includes(q)
    }
    return true
  })

  if (loading) return <DashboardSkeleton />
  if (error) return <ErrorState title="Error" message={error} onRetry={loadContacts} />

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 text-sm mt-1">{contacts.length} total messages • {contacts.filter(c => c.status !== 'read').length} unread</p>
        </div>
        <button onClick={loadContacts} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-primary-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No contact messages found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(contact => (
            <div key={contact.id}
              className={`bg-white rounded-xl border shadow-sm transition-all hover:shadow-md ${
                contact.status === 'read'
                  ? 'border-gray-100'
                  : 'border-l-4 border-l-primary-500 border-gray-100'
              }`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      contact.status === 'read' ? 'bg-gray-100 text-gray-500' : 'bg-primary-100 text-primary-600'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-sm ${contact.status === 'read' ? 'text-gray-600' : 'text-gray-900'}`}>
                          {contact.name || 'Anonymous'}
                        </h3>
                        {contact.status !== 'read' && (
                          <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{contact.email || 'No email'}</p>
                      {contact.subject && (
                        <p className="text-sm font-medium text-gray-700 mb-1">{contact.subject}</p>
                      )}
                      <p className={`text-sm text-gray-500 ${expandedId === contact.id ? '' : 'line-clamp-2'}`}>
                        {contact.message || 'No message'}
                      </p>
                      {(contact.message || '').length > 100 && (
                        <button onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                          className="text-primary-600 text-xs font-medium mt-1 hover:text-primary-700">
                          {expandedId === contact.id ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                    </span>
                    {contact.status !== 'read' && (
                      <button onClick={() => handleMarkRead(contact.id)} title="Mark as read"
                        className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(contact.id)} title="Delete"
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
