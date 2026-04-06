import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, setDoc
} from 'firebase/firestore'
import { db } from './firebase'

// ===================== Generic CRUD =====================

export async function createDocument(collectionName, data, docId = null) {
  try {
    const now = new Date().toISOString()
    const docData = { ...data, createdAt: now, updatedAt: now }
    if (docId) {
      await setDoc(doc(db, collectionName, docId), docData)
      return docId
    }
    const docRef = await addDoc(collection(db, collectionName), docData)
    return docRef.id
  } catch (err) {
    console.error(`Error creating ${collectionName}:`, err)
    throw err
  }
}

export async function getDocument(collectionName, docId) {
  try {
    const snap = await getDoc(doc(db, collectionName, docId))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
  } catch (err) {
    console.error(`Error getting ${collectionName}/${docId}:`, err)
    return null
  }
}

export async function updateDocument(collectionName, docId, data) {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: new Date().toISOString()
    })
    return true
  } catch (err) {
    console.error(`Error updating ${collectionName}/${docId}:`, err)
    return false
  }
}

export async function deleteDocument(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId))
    return true
  } catch (err) {
    console.error(`Error deleting ${collectionName}/${docId}:`, err)
    return false
  }
}

export async function getAllDocuments(collectionName) {
  try {
    const snap = await getDocs(collection(db, collectionName))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error(`Error getting all ${collectionName}:`, err)
    return []
  }
}

export async function queryDocuments(collectionName, field, operator, value) {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error(`Error querying ${collectionName}:`, err)
    return []
  }
}

// ===================== Services =====================

export async function createService(serviceData) {
  return await createDocument('services', {
    ...serviceData,
    is_active: true,
    rating: 0,
    total_reviews: 0,
  })
}

export async function getAllServices() {
  return await getAllDocuments('services')
}

export async function getServiceById(id) {
  return await getDocument('services', id)
}

export async function getUserServices(userId) {
  return await queryDocuments('services', 'worker_id', '==', userId)
}

// ===================== Jobs =====================

export async function createJob(jobData) {
  return await createDocument('jobs', {
    ...jobData,
    is_active: true,
    applications_count: 0,
  })
}

export async function getAllJobs() {
  return await getAllDocuments('jobs')
}

export async function getJobById(id) {
  return await getDocument('jobs', id)
}

export async function getUserJobs(userId) {
  return await queryDocuments('jobs', 'posted_by', '==', userId)
}

// ===================== Gigs =====================

export async function createGig(gigData) {
  return await createDocument('gigs', {
    ...gigData,
    status: 'open',
    assignedTo: null,
    assignedName: null,
  })
}

export async function getAllGigs() {
  return await getAllDocuments('gigs')
}

export async function getGigById(id) {
  return await getDocument('gigs', id)
}

export async function getUserGigs(userId) {
  return await queryDocuments('gigs', 'employer_id', '==', userId)
}

export async function acceptGig(gigId, userId, userName) {
  const gig = await getDocument('gigs', gigId)
  if (!gig) throw new Error('Gig not found')
  if (gig.assignedTo) throw new Error('This gig has already been taken by another user')
  if (gig.status !== 'open') throw new Error('This gig is no longer available')

  await updateDocument('gigs', gigId, {
    assignedTo: userId,
    assignedName: userName,
    status: 'in-progress',
  })
  return true
}

export async function completeGig(gigId, userId) {
  const gig = await getDocument('gigs', gigId)
  if (!gig) throw new Error('Gig not found')
  if (gig.assignedTo !== userId) throw new Error('Only the assigned user can complete this gig')

  await updateDocument('gigs', gigId, { status: 'completed' })
  return true
}

// ===================== Job Applications =====================

export async function applyToJob(applicationData) {
  // Prevent duplicate applications
  const existing = await queryDocuments('applications', 'jobId', '==', applicationData.jobId)
  const alreadyApplied = existing.find(a => a.userId === applicationData.userId)
  if (alreadyApplied) {
    throw new Error('You have already applied to this job')
  }

  return await createDocument('applications', {
    ...applicationData,
    status: 'applied',
  })
}

export async function getJobApplications(jobId) {
  return await queryDocuments('applications', 'jobId', '==', jobId)
}

export async function getUserApplications(userId) {
  return await queryDocuments('applications', 'userId', '==', userId)
}

export async function hasUserApplied(jobId, userId) {
  const apps = await queryDocuments('applications', 'jobId', '==', jobId)
  return apps.some(a => a.userId === userId)
}

// ===================== Reviews =====================

export async function createReview(reviewData) {
  const existing = await queryDocuments('reviews', 'booking_id', '==', reviewData.booking_id)
  if (existing.length > 0) {
    throw new Error('You have already reviewed this booking')
  }
  const reviewId = await createDocument('reviews', reviewData)

  // Auto-update worker average rating
  if (reviewData.worker_id) {
    await updateWorkerRating(reviewData.worker_id)
  }

  return reviewId
}

export async function getServiceReviews(serviceId) {
  return await queryDocuments('reviews', 'service_id', '==', serviceId)
}

export async function getPublicTestimonials() {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('rating', '>=', 4),
      orderBy('rating', 'desc'),
      limit(6)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Error fetching testimonials:', err)
    return []
  }
}

// ===================== Worker Rating Auto-Update =====================

export async function updateWorkerRating(workerId) {
  try {
    const reviews = await queryDocuments('reviews', 'worker_id', '==', workerId)
    if (reviews.length === 0) return

    const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    const roundedRating = Math.round(avgRating * 10) / 10

    // Update worker's user profile
    await updateDocument('users', workerId, {
      rating: roundedRating,
      total_reviews: reviews.length,
    })

    // Also update any services by this worker
    const services = await queryDocuments('services', 'worker_id', '==', workerId)
    for (const svc of services) {
      await updateDocument('services', svc.id, {
        rating: roundedRating,
        total_reviews: reviews.length,
      })
    }
  } catch (err) {
    console.error('Error updating worker rating:', err)
  }
}

// ===================== Bookings =====================

/**
 * Check if a worker is already booked for specific date + time slot.
 * Prevents double-booking: same worker + same date + same slot.
 */
export async function checkDoubleBooking(workerId, date, timeSlot) {
  try {
    const bookings = await queryDocuments('bookings', 'worker_id', '==', workerId)
    return bookings.some(
      b => b.booking_date === date &&
           b.time_slot === timeSlot &&
           b.status !== 'cancelled'
    )
  } catch (err) {
    console.error('Error checking double booking:', err)
    return false
  }
}

export async function createBooking(bookingData) {
  // Enforce double-booking prevention
  if (bookingData.worker_id && bookingData.booking_date && bookingData.time_slot) {
    const isBooked = await checkDoubleBooking(
      bookingData.worker_id,
      bookingData.booking_date,
      bookingData.time_slot
    )
    if (isBooked) {
      throw new Error('This worker is already booked for the selected date and time slot. Please choose a different slot.')
    }
  }

  return await createDocument('bookings', {
    ...bookingData,
    status: 'requested',
    payment_status: 'pending',
  })
}

export async function updateBookingStatus(bookingId, status) {
  return await updateDocument('bookings', bookingId, { status })
}

export async function getUserBookings(userId) {
  const asCustomer = await queryDocuments('bookings', 'customer_id', '==', userId)
  const asWorker = await queryDocuments('bookings', 'worker_id', '==', userId)
  const seen = new Set()
  const all = []
  for (const b of [...asCustomer, ...asWorker]) {
    if (!seen.has(b.id)) {
      seen.add(b.id)
      all.push(b)
    }
  }
  return all.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

// ===================== Payments (Simulated) =====================

export async function simulatePayment(bookingId, amount, userId) {
  const paymentId = await createDocument('payments', {
    booking_id: bookingId,
    user_id: userId,
    amount,
    currency: 'INR',
    status: 'paid',
    payment_method: 'simulated',
    paid_at: new Date().toISOString(),
  })
  await updateDocument('bookings', bookingId, { payment_status: 'paid' })
  return paymentId
}

// ===================== Invoices =====================

export async function generateInvoice(bookingId, bookingData) {
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  const subtotal = bookingData.amount || 0
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  const invoiceData = {
    invoice_number: invoiceNumber,
    booking_id: bookingId,
    customer_id: bookingData.customer_id || '',
    customer_name: bookingData.customer_name || '',
    worker_id: bookingData.worker_id || '',
    worker_name: bookingData.worker_name || '',
    service_title: bookingData.service_title || '',
    booking_date: bookingData.booking_date || '',
    time_slot: bookingData.time_slot || '',
    address: bookingData.address || '',
    subtotal,
    tax,
    total,
    status: 'generated',
  }

  const invoiceId = await createDocument('invoices', invoiceData)
  return { id: invoiceId, ...invoiceData }
}

export async function getBookingInvoice(bookingId) {
  const invoices = await queryDocuments('invoices', 'booking_id', '==', bookingId)
  return invoices.length > 0 ? invoices[0] : null
}

export async function getUserInvoices(userId) {
  return await queryDocuments('invoices', 'customer_id', '==', userId)
}

// ===================== Reports =====================

export async function createReport(reportData) {
  return await createDocument('reports', reportData)
}

export async function getAllReports() {
  return await getAllDocuments('reports')
}
