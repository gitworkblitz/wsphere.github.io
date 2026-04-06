import React, { useState } from 'react'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'

const TAGS = ['Professional', 'On Time', 'Great Value', 'Skilled', 'Friendly', 'Quick Service', 'Clean Work', 'Expert']

export default function ReviewModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(false)

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return
    setLoading(true)
    try {
      await onSubmit({ rating, comment, tags: selectedTags })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Rate & Review</h3>
            <p className="text-white/80 text-sm">Share your experience</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Stars */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-3">How was the service?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-125 focus:scale-125">
                  {star <= (hover || rating) ? (
                    <StarSolid className="w-10 h-10 text-yellow-400 drop-shadow-sm" />
                  ) : (
                    <StarOutline className="w-10 h-10 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {rating === 0 ? 'Tap a star to rate' :
               rating === 1 ? 'Poor' :
               rating === 2 ? 'Fair' :
               rating === 3 ? 'Good' :
               rating === 4 ? 'Very Good' : 'Excellent!'}
            </p>
          </div>

          {/* Comment */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Review</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              rows={3} placeholder="Tell us about your experience..."
              className="input-field resize-none" />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Tags (optional)</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary py-2.5">Cancel</button>
            <button type="submit" disabled={rating === 0 || loading}
              className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
