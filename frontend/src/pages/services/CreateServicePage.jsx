import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { createService } from '../../services/firestoreService'
import { SERVICE_CATEGORIES } from '../../utils/dummyData'
import toast from 'react-hot-toast'
import { PlusIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline'

const TIME_SLOTS = [
  '7:00 AM – 9:00 AM', '9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM',
  '1:00 PM – 3:00 PM', '3:00 PM – 5:00 PM', '5:00 PM – 7:00 PM', '7:00 PM – 9:00 PM'
]

export default function CreateServicePage() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [availability, setAvailability] = useState([])

  const toggleSlot = (slot) => {
    setAvailability(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    )
  }

  const onSubmit = async (data) => {
    if (!user) { toast.error('Please login to post a service'); navigate('/login'); return }
    if (availability.length === 0) { toast.error('Please select at least one availability slot'); return }
    try {
      setLoading(true)
      await createService({
        title: data.title,
        category: data.category,
        description: data.description,
        price: Number(data.price),
        duration: Number(data.duration),
        location: data.location,
        availability,
        worker_id: user.uid,
        worker_name: userProfile?.name || user.displayName || user.email,
        worker_avatar: userProfile?.avatar || '',
        worker_rating: userProfile?.rating || 0,
      })
      toast.success('Service created successfully! 🎉')
      navigate('/services')
    } catch (e) {
      console.error('Create service error:', e)
      toast.error(e.message || 'Failed to create service. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="page-header">Post a New Service</h1>
          <p className="page-subtitle">List your service and start receiving bookings</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Service Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="input-field"
                placeholder="e.g. Professional Home Cleaning"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select {...register('category', { required: 'Category is required' })} className="input-field">
                <option value="">Select category</option>
                {SERVICE_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea
                {...register('description', { required: 'Description is required', minLength: { value: 30, message: 'Minimum 30 characters' } })}
                rows={4} className="input-field"
                placeholder="Describe your service in detail — what's included, tools used, experience, etc."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Price + Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (₹)</label>
                <input
                  {...register('price', { required: 'Price is required', min: { value: 1, message: 'Min ₹1' } })}
                  type="number" className="input-field" placeholder="500"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Duration (minutes)</label>
                <input
                  {...register('duration', { required: 'Duration is required', min: { value: 15, message: 'Min 15 min' } })}
                  type="number" className="input-field" placeholder="60"
                />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Service Location / Area</label>
              <input
                {...register('location', { required: 'Location is required' })}
                className="input-field" placeholder="e.g. Connaught Place, Delhi"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>

            {/* Availability Time Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4" />
                Availability Slots <span className="text-red-500">*</span>
                <span className="text-xs text-gray-400 font-normal ml-1">(select all that apply)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    className={`text-sm px-3 py-2.5 rounded-xl border font-medium transition-all text-left flex items-center gap-2 ${
                      availability.includes(slot)
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <ClockIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {slot}
                  </button>
                ))}
              </div>
              {availability.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">No slots selected yet</p>
              )}
              {availability.length > 0 && (
                <p className="text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium">
                  {availability.length} slot{availability.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating…</>
                ) : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
