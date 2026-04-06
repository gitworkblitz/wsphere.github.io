import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HomeIcon, CalendarIcon, WrenchScrewdriverIcon,
  BriefcaseIcon, CurrencyDollarIcon, DocumentTextIcon,
  UserIcon, CreditCardIcon, Bars3Icon, XMarkIcon,
  ArrowRightOnRectangleIcon, ChevronDoubleLeftIcon, ShieldCheckIcon
} from '@heroicons/react/24/outline'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { label: 'My Bookings', to: '/dashboard/bookings', icon: CalendarIcon },
  { label: 'My Services', to: '/dashboard/services', icon: WrenchScrewdriverIcon },
  { label: 'My Jobs', to: '/dashboard/jobs', icon: BriefcaseIcon },
  { label: 'My Gigs', to: '/dashboard/gigs', icon: CurrencyDollarIcon },
  { label: 'Payments', to: '/payments', icon: CreditCardIcon },
  { label: 'Invoices', to: '/invoices', icon: DocumentTextIcon },
  { label: 'Profile', to: '/profile', icon: UserIcon },
]

function SidebarContent({ onClose }) {
  const { user, userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (to) => location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">WS</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">WorkSphere</span>
        </Link>
        {onClose && <button onClick={onClose} className="text-gray-400 hover:text-gray-600 md:hidden"><XMarkIcon className="w-5 h-5" /></button>}
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {(userProfile?.name || 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{userProfile?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userProfile?.user_type || 'customer'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, to, icon: Icon }) => (
          <Link key={to} to={to} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(to) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive(to) ? 'text-primary-600' : 'text-gray-400'}`} />
            {label}
          </Link>
        ))}
        {userProfile?.user_type === 'admin' && (
          <Link to="/admin" onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.startsWith('/admin') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <ShieldCheckIcon className="w-5 h-5 text-gray-400" />Admin Panel
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />Logout
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative z-50 w-64 h-full shadow-2xl">
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="text-gray-500 hover:text-gray-900">
            <Bars3Icon className="w-6 h-6" />
          </button>
          <Link to="/" className="font-bold text-primary-600 text-lg">WorkSphere</Link>
          <Link to="/profile"><div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">U</div></Link>
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
