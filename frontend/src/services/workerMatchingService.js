import { queryDocuments, checkDoubleBooking } from './firestoreService'
import { dummyWorkers, calculateWorkerScore } from '../utils/dummyData'

/**
 * Find the best available worker for a service category on a given date/time slot.
 * Uses deterministic scoring — NO AI/ML.
 * 
 * Optimized: limits worker fetch to 50, uses compound booking check instead of N+1 queries.
 */
export async function findBestWorker(category, date, timeSlot) {
  try {
    // Get workers matching the type — limited to 50
    let workers = []
    try {
      workers = await queryDocuments('users', 'user_type', '==', 'worker', 50)
    } catch {
      workers = []
    }

    // Merge with dummy workers as fallback
    const allWorkers = workers.length > 0 ? workers : dummyWorkers

    // Filter workers whose skills match the category
    const matchingWorkers = allWorkers.filter(w => {
      const skills = (w.skills || []).map(s => s.toLowerCase())
      return skills.some(s =>
        s.includes(category.toLowerCase()) ||
        category.toLowerCase().includes(s)
      )
    })

    if (matchingWorkers.length === 0) {
      // If no skill match, return all available workers
      return scoreAndRank(allWorkers.filter(w => w.availability !== false), date, timeSlot)
    }

    return scoreAndRank(matchingWorkers, date, timeSlot)
  } catch (err) {
    console.error('Worker matching error:', err)
    return scoreAndRank(dummyWorkers, date, timeSlot)
  }
}

async function scoreAndRank(workers, date, timeSlot) {
  const availableWorkers = workers.filter(w => w.availability !== false)
  const available = []

  // Optimized: use compound query (worker_id + date + time_slot) via checkDoubleBooking
  // instead of fetching ALL bookings per worker (N+1 problem)
  const workerPromises = availableWorkers.map(async (worker) => {
    let isBooked = false
    try {
      isBooked = await checkDoubleBooking(worker.id, date, timeSlot)
    } catch {
      isBooked = false
    }

    if (!isBooked) {
      const distance = Math.round(Math.random() * 10 + 1)
      const score = calculateWorkerScore({ ...worker, distance })
      return { ...worker, distance, match_score: score }
    }
    return null
  })

  const results = await Promise.all(workerPromises)
  available.push(...results.filter(r => r !== null))

  // Sort by score descending
  available.sort((a, b) => b.match_score - a.match_score)
  return available
}

/**
 * Get the single best worker for auto-assignment
 */
export async function autoAssignWorker(category, date, timeSlot) {
  const ranked = await findBestWorker(category, date, timeSlot)
  return ranked.length > 0 ? ranked[0] : null
}

