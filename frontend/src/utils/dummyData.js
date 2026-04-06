// ========================================
// WorkSphere — Realistic Dummy Data
// Used as fallback when Firestore is empty
// Delhi NCR focused
// ========================================

// ===================== SERVICE CATEGORIES =====================
export const SERVICE_CATEGORIES = [
  { label: 'Electrician', emoji: '⚡', value: 'Electrician' },
  { label: 'Plumber', emoji: '🔧', value: 'Plumber' },
  { label: 'Carpenter', emoji: '🪚', value: 'Carpenter' },
  { label: 'Mason', emoji: '🧱', value: 'Mason' },
  { label: 'Painter', emoji: '🎨', value: 'Painter' },
  { label: 'AC Repair', emoji: '❄️', value: 'AC Repair' },
  { label: 'Washing Machine', emoji: '🫧', value: 'Washing Machine Repair' },
  { label: 'Refrigerator', emoji: '🧊', value: 'Refrigerator Repair' },
  { label: 'RO Purifier', emoji: '💧', value: 'RO Water Purifier Service' },
  { label: 'Home Cleaning', emoji: '🧹', value: 'Home Cleaning' },
  { label: 'Pest Control', emoji: '🐛', value: 'Pest Control' },
  { label: 'Appliance Repair', emoji: '🔌', value: 'Appliance Repair' },
  { label: 'Mobile Repair', emoji: '📱', value: 'Mobile Repair' },
  { label: 'Laptop Repair', emoji: '💻', value: 'Computer/Laptop Repair' },
  { label: 'Delivery Service', emoji: '🚚', value: 'Delivery Services' },
  { label: 'Driver Service', emoji: '🚗', value: 'Driver Services' },
  { label: 'Security Guard', emoji: '🛡️', value: 'Security Guard' },
  { label: 'Housekeeping', emoji: '🏠', value: 'Housekeeping' },
  { label: 'Salon at Home', emoji: '💇', value: 'Salon at Home' },
  { label: 'Tailor', emoji: '🧵', value: 'Tailor Services' },
]

// ===================== DUMMY WORKERS =====================
export const dummyWorkers = [
  {
    id: 'w1', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210',
    skills: ['Plumber', 'Pipe Fitting'], location: 'Lajpat Nagar', bio: 'Experienced plumber with 8+ years. Specializing in residential and commercial plumbing solutions.',
    rating: 4.8, total_reviews: 124, experience_years: 8, completion_rate: 97, availability: true,
    lat: 28.5700, lng: 77.2400, hourly_rate: 500, user_type: 'worker', avatar_color: 'bg-blue-500',
  },
  {
    id: 'w2', name: 'Priya Singh', email: 'priya@example.com', phone: '+91 98765 43211',
    skills: ['Home Cleaning', 'Deep Cleaning', 'Office Cleaning'], location: 'Connaught Place', bio: 'Professional cleaner providing spotless results. Eco-friendly products used.',
    rating: 4.9, total_reviews: 89, experience_years: 5, completion_rate: 99, availability: true,
    lat: 28.6315, lng: 77.2167, hourly_rate: 400, user_type: 'worker', avatar_color: 'bg-pink-500',
  },
  {
    id: 'w3', name: 'Amar Patel', email: 'amar@example.com', phone: '+91 98765 43212',
    skills: ['Electrician', 'Wiring', 'AC Repair'], location: 'Karol Bagh', bio: 'Licensed electrician. Expert in wiring, switchboard installation, and AC servicing.',
    rating: 4.7, total_reviews: 156, experience_years: 10, completion_rate: 95, availability: true,
    lat: 28.6514, lng: 77.1907, hourly_rate: 600, user_type: 'worker', avatar_color: 'bg-yellow-500',
  },
  {
    id: 'w4', name: 'Sunita Devi', email: 'sunita@example.com', phone: '+91 98765 43213',
    skills: ['Painter', 'Wall Art', 'Texture Painting'], location: 'Rajouri Garden', bio: 'Creative painter with modern techniques. Interior and exterior painting specialist.',
    rating: 4.6, total_reviews: 67, experience_years: 6, completion_rate: 93, availability: true,
    lat: 28.6492, lng: 77.1219, hourly_rate: 550, user_type: 'worker', avatar_color: 'bg-purple-500',
  },
  {
    id: 'w5', name: 'Vikram Choudhary', email: 'vikram@example.com', phone: '+91 98765 43214',
    skills: ['Carpenter', 'Furniture Repair', 'Wood Work'], location: 'Dwarka', bio: 'Skilled carpenter specializing in custom furniture and repair work.',
    rating: 4.5, total_reviews: 98, experience_years: 12, completion_rate: 96, availability: true,
    lat: 28.5921, lng: 77.0460, hourly_rate: 700, user_type: 'worker', avatar_color: 'bg-orange-500',
  },
  {
    id: 'w6', name: 'Meena Kumari', email: 'meena@example.com', phone: '+91 98765 43215',
    skills: ['Housekeeping', 'Home Cleaning', 'Gardening'], location: 'Hauz Khas', bio: 'Professional housekeeper. Deep cleaning, lawn maintenance, and indoor plant care.',
    rating: 4.8, total_reviews: 45, experience_years: 4, completion_rate: 98, availability: true,
    lat: 28.5494, lng: 77.2001, hourly_rate: 350, user_type: 'worker', avatar_color: 'bg-green-500',
  },
  {
    id: 'w7', name: 'Arjun Reddy', email: 'arjun@example.com', phone: '+91 98765 43216',
    skills: ['AC Repair', 'Refrigerator Repair', 'Appliance Repair'], location: 'Saket', bio: 'Certified HVAC technician. All brands of AC, fridge, and cooling systems.',
    rating: 4.7, total_reviews: 112, experience_years: 7, completion_rate: 96, availability: true,
    lat: 28.5245, lng: 77.2066, hourly_rate: 650, user_type: 'worker', avatar_color: 'bg-cyan-500',
  },
  {
    id: 'w8', name: 'Fatima Khan', email: 'fatima@example.com', phone: '+91 98765 43217',
    skills: ['Salon at Home', 'Bridal Makeup', 'Hair Styling'], location: 'Khan Market', bio: 'Professional beautician offering salon services at your doorstep. Bridal packages available.',
    rating: 4.9, total_reviews: 78, experience_years: 6, completion_rate: 99, availability: true,
    lat: 28.6003, lng: 77.2274, hourly_rate: 800, user_type: 'worker', avatar_color: 'bg-rose-500',
  },
  {
    id: 'w9', name: 'Suresh Yadav', email: 'suresh@example.com', phone: '+91 98765 43218',
    skills: ['Mason', 'Tile Work', 'Waterproofing'], location: 'Rohini', bio: 'Expert mason with specialization in tile fitting, plastering, and waterproofing solutions.',
    rating: 4.4, total_reviews: 86, experience_years: 9, completion_rate: 92, availability: true,
    lat: 28.7495, lng: 77.0565, hourly_rate: 600, user_type: 'worker', avatar_color: 'bg-amber-600',
  },
  {
    id: 'w10', name: 'Kavitha Nair', email: 'kavitha@example.com', phone: '+91 98765 43219',
    skills: ['Pest Control', 'Termite Treatment', 'Fumigation'], location: 'Defence Colony', bio: 'Licensed pest control specialist. Safe, eco-friendly treatments for homes and offices.',
    rating: 4.6, total_reviews: 54, experience_years: 5, completion_rate: 97, availability: true,
    lat: 28.5742, lng: 77.2340, hourly_rate: 500, user_type: 'worker', avatar_color: 'bg-lime-600',
  },
  {
    id: 'w11', name: 'Rohit Sharma', email: 'rohit@example.com', phone: '+91 98765 43220',
    skills: ['Mobile Repair', 'Screen Replacement', 'Software Fix'], location: 'Chandni Chowk', bio: 'Mobile phone repair expert. All brands — Apple, Samsung, OnePlus, Xiaomi and more.',
    rating: 4.5, total_reviews: 132, experience_years: 4, completion_rate: 94, availability: true,
    lat: 28.6562, lng: 77.2302, hourly_rate: 400, user_type: 'worker', avatar_color: 'bg-indigo-500',
  },
  {
    id: 'w12', name: 'Deepak Mishra', email: 'deepak@example.com', phone: '+91 98765 43221',
    skills: ['Computer/Laptop Repair', 'Networking', 'Data Recovery'], location: 'Noida Sector 62', bio: 'IT hardware specialist. Laptop repair, OS installation, virus removal, and data recovery.',
    rating: 4.7, total_reviews: 91, experience_years: 8, completion_rate: 95, availability: true,
    lat: 28.6270, lng: 77.3653, hourly_rate: 550, user_type: 'worker', avatar_color: 'bg-violet-500',
  },
  {
    id: 'w13', name: 'Ramesh Gupta', email: 'ramesh@example.com', phone: '+91 98765 43222',
    skills: ['Driver Services', 'Outstation Trips', 'Airport Transfer'], location: 'Rajiv Chowk', bio: 'Professional driver with commercial license. City rides, airport transfers, and outstation trips.',
    rating: 4.3, total_reviews: 64, experience_years: 10, completion_rate: 91, availability: true,
    lat: 28.6328, lng: 77.2197, hourly_rate: 350, user_type: 'worker', avatar_color: 'bg-teal-500',
  },
  {
    id: 'w14', name: 'Anita Joshi', email: 'anita@example.com', phone: '+91 98765 43223',
    skills: ['Tailor Services', 'Alterations', 'Custom Stitching'], location: 'Chittaranjan Park', bio: 'Expert tailor for men and women. Blouse stitching, alterations, and custom outfits.',
    rating: 4.8, total_reviews: 76, experience_years: 10, completion_rate: 98, availability: true,
    lat: 28.5388, lng: 77.2479, hourly_rate: 450, user_type: 'worker', avatar_color: 'bg-fuchsia-500',
  },
  {
    id: 'w15', name: 'Manoj Tiwari', email: 'manoj@example.com', phone: '+91 98765 43224',
    skills: ['Washing Machine Repair', 'Appliance Repair'], location: 'Noida Sector 15', bio: 'Washing machine specialist — front load, top load, semi-automatic. All major brands.',
    rating: 4.4, total_reviews: 58, experience_years: 5, completion_rate: 93, availability: true,
    lat: 28.5836, lng: 77.3100, hourly_rate: 450, user_type: 'worker', avatar_color: 'bg-sky-500',
  },
  {
    id: 'w16', name: 'Sanjay Verma', email: 'sanjay@example.com', phone: '+91 98765 43225',
    skills: ['RO Water Purifier Service', 'Water Testing'], location: 'Barakhamba Road', bio: 'RO purifier installation, repair, and annual maintenance. All brands serviced.',
    rating: 4.5, total_reviews: 42, experience_years: 3, completion_rate: 95, availability: true,
    lat: 28.6340, lng: 77.2280, hourly_rate: 400, user_type: 'worker', avatar_color: 'bg-blue-400',
  },
  {
    id: 'w17', name: 'Prakash Raj', email: 'prakash@example.com', phone: '+91 98765 43226',
    skills: ['Security Guard', 'CCTV Monitoring'], location: 'Gurgaon Cyber City', bio: 'Former military personnel. Professional security services for events, offices, and residences.',
    rating: 4.6, total_reviews: 38, experience_years: 8, completion_rate: 99, availability: true,
    lat: 28.4949, lng: 77.0882, hourly_rate: 300, user_type: 'worker', avatar_color: 'bg-slate-600',
  },
  {
    id: 'w18', name: 'Pooja Bansal', email: 'pooja@example.com', phone: '+91 98765 43227',
    skills: ['Delivery Services', 'Courier', 'Parcel Handling'], location: 'Golf Course Road', bio: 'Reliable same-day delivery and courier services within Delhi NCR. Fragile items handled with care.',
    rating: 4.3, total_reviews: 49, experience_years: 2, completion_rate: 96, availability: true,
    lat: 28.4595, lng: 77.1025, hourly_rate: 250, user_type: 'worker', avatar_color: 'bg-orange-400',
  },
]

// ===================== DUMMY SERVICES =====================
export const dummyServices = [
  {
    id: 's1', title: 'Professional Home Cleaning', description: 'Complete home cleaning with eco-friendly products. Includes kitchen, bathroom, and all living areas. Deep cleaning available.',
    category: 'Home Cleaning', price: 1500, location: 'Connaught Place', worker_id: 'w2', worker_name: 'Priya Singh',
    rating: 4.9, total_reviews: 89, is_active: true, image_emoji: '🧹',
    createdAt: '2025-12-01T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 's2', title: 'Plumbing & Pipe Repair', description: 'Expert plumbing services — leak repair, pipe installation, bathroom fitting, and drainage solutions. Emergency service available.',
    category: 'Plumber', price: 800, location: 'Lajpat Nagar', worker_id: 'w1', worker_name: 'Rajesh Kumar',
    rating: 4.8, total_reviews: 124, is_active: true, image_emoji: '🔧',
    createdAt: '2025-11-20T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 's3', title: 'Electrical Wiring & Repair', description: 'Complete electrical solutions — wiring, switchboard installation, fan/light fitting, MCB and safety inspection.',
    category: 'Electrician', price: 1200, location: 'Karol Bagh', worker_id: 'w3', worker_name: 'Amar Patel',
    rating: 4.7, total_reviews: 156, is_active: true, image_emoji: '⚡',
    createdAt: '2025-11-15T10:00:00Z', updatedAt: '2026-01-05T10:00:00Z',
  },
  {
    id: 's4', title: 'Interior & Exterior Painting', description: 'Transform your space with professional painting. Texture painting, wall art, and expert color consultation included.',
    category: 'Painter', price: 2500, location: 'Rajouri Garden', worker_id: 'w4', worker_name: 'Sunita Devi',
    rating: 4.6, total_reviews: 67, is_active: true, image_emoji: '🎨',
    createdAt: '2025-12-10T10:00:00Z', updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 's5', title: 'Custom Furniture & Carpentry', description: 'Bespoke woodwork — custom furniture, cabinet installation, door repair, and wood polishing by skilled carpenters.',
    category: 'Carpenter', price: 3000, location: 'Dwarka', worker_id: 'w5', worker_name: 'Vikram Choudhary',
    rating: 4.5, total_reviews: 98, is_active: true, image_emoji: '🪚',
    createdAt: '2025-11-25T10:00:00Z', updatedAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 's6', title: 'Housekeeping & Gardening', description: 'Professional housekeeping — lawn maintenance, indoor plant care, daily cleaning, and terrace garden setup.',
    category: 'Housekeeping', price: 1000, location: 'Hauz Khas', worker_id: 'w6', worker_name: 'Meena Kumari',
    rating: 4.8, total_reviews: 45, is_active: true, image_emoji: '🏠',
    createdAt: '2025-12-05T10:00:00Z', updatedAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 's7', title: 'AC Installation & Repair', description: 'Split AC, window AC installation, gas refilling, compressor repair, and annual maintenance. All brands covered.',
    category: 'AC Repair', price: 1800, location: 'Saket', worker_id: 'w7', worker_name: 'Arjun Reddy',
    rating: 4.7, total_reviews: 112, is_active: true, image_emoji: '❄️',
    createdAt: '2025-12-08T10:00:00Z', updatedAt: '2026-01-22T10:00:00Z',
  },
  {
    id: 's8', title: 'Salon & Beauty at Home', description: 'Complete salon experience at your doorstep — haircut, facial, waxing, bridal makeup, and grooming packages.',
    category: 'Salon at Home', price: 1500, location: 'Khan Market', worker_id: 'w8', worker_name: 'Fatima Khan',
    rating: 4.9, total_reviews: 78, is_active: true, image_emoji: '💇',
    createdAt: '2025-12-12T10:00:00Z', updatedAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 's9', title: 'Masonry & Tile Work', description: 'Professional masonry — wall construction, tile fitting, plastering, waterproofing, and bathroom renovation.',
    category: 'Mason', price: 2000, location: 'Rohini', worker_id: 'w9', worker_name: 'Suresh Yadav',
    rating: 4.4, total_reviews: 86, is_active: true, image_emoji: '🧱',
    createdAt: '2025-12-15T10:00:00Z', updatedAt: '2026-01-28T10:00:00Z',
  },
  {
    id: 's10', title: 'Pest Control Treatment', description: 'Complete pest control — cockroach, termite, bed bug, mosquito, and rodent treatment. Safe for kids and pets.',
    category: 'Pest Control', price: 2500, location: 'Defence Colony', worker_id: 'w10', worker_name: 'Kavitha Nair',
    rating: 4.6, total_reviews: 54, is_active: true, image_emoji: '🐛',
    createdAt: '2025-12-18T10:00:00Z', updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 's11', title: 'Mobile Phone Repair', description: 'Screen replacement, battery change, charging port fix, software issues, and water damage repair. All brands.',
    category: 'Mobile Repair', price: 500, location: 'Chandni Chowk', worker_id: 'w11', worker_name: 'Rohit Sharma',
    rating: 4.5, total_reviews: 132, is_active: true, image_emoji: '📱',
    createdAt: '2025-12-20T10:00:00Z', updatedAt: '2026-02-03T10:00:00Z',
  },
  {
    id: 's12', title: 'Laptop & Computer Repair', description: 'Laptop repair, OS installation, virus removal, data recovery, RAM/SSD upgrade, and networking setup.',
    category: 'Computer/Laptop Repair', price: 800, location: 'Noida Sector 62', worker_id: 'w12', worker_name: 'Deepak Mishra',
    rating: 4.7, total_reviews: 91, is_active: true, image_emoji: '💻',
    createdAt: '2025-12-22T10:00:00Z', updatedAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 's13', title: 'Washing Machine Repair', description: 'Repair for all types — front load, top load, semi-automatic. Drum, motor, PCB, and drain pump servicing.',
    category: 'Washing Machine Repair', price: 700, location: 'Noida Sector 15', worker_id: 'w15', worker_name: 'Manoj Tiwari',
    rating: 4.4, total_reviews: 58, is_active: true, image_emoji: '🫧',
    createdAt: '2025-12-25T10:00:00Z', updatedAt: '2026-02-08T10:00:00Z',
  },
  {
    id: 's14', title: 'RO Purifier Service', description: 'RO water purifier installation, filter change, membrane replacement, and annual maintenance contract.',
    category: 'RO Water Purifier Service', price: 600, location: 'Barakhamba Road', worker_id: 'w16', worker_name: 'Sanjay Verma',
    rating: 4.5, total_reviews: 42, is_active: true, image_emoji: '💧',
    createdAt: '2025-12-28T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 's15', title: 'Refrigerator Repair', description: 'Fridge not cooling? Gas refill, compressor, thermostat, and door gasket repair. Single and double door models.',
    category: 'Refrigerator Repair', price: 900, location: 'Saket', worker_id: 'w7', worker_name: 'Arjun Reddy',
    rating: 4.6, total_reviews: 73, is_active: true, image_emoji: '🧊',
    createdAt: '2026-01-02T10:00:00Z', updatedAt: '2026-02-12T10:00:00Z',
  },
  {
    id: 's16', title: 'Driver on Demand', description: 'Professional driver for city rides, airport transfers, outstation trips, and weddings. Commercial license holder.',
    category: 'Driver Services', price: 1200, location: 'Rajiv Chowk', worker_id: 'w13', worker_name: 'Ramesh Gupta',
    rating: 4.3, total_reviews: 64, is_active: true, image_emoji: '🚗',
    createdAt: '2026-01-05T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 's17', title: 'Tailoring & Alterations', description: 'Expert stitching — blouse, kurta, suits, alterations, hemming, and custom outfits. Pickup & delivery available.',
    category: 'Tailor Services', price: 400, location: 'Chittaranjan Park', worker_id: 'w14', worker_name: 'Anita Joshi',
    rating: 4.8, total_reviews: 76, is_active: true, image_emoji: '🧵',
    createdAt: '2026-01-08T10:00:00Z', updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 's18', title: 'Security Guard Service', description: 'Trained security personnel for events, offices, and residential complexes. Day and night shifts available.',
    category: 'Security Guard', price: 800, location: 'Gurgaon Cyber City', worker_id: 'w17', worker_name: 'Prakash Raj',
    rating: 4.6, total_reviews: 38, is_active: true, image_emoji: '🛡️',
    createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 's19', title: 'Same-Day Delivery', description: 'Reliable same-day pickup and delivery within Delhi NCR. Documents, parcels, and fragile items handled with care.',
    category: 'Delivery Services', price: 200, location: 'Golf Course Road', worker_id: 'w18', worker_name: 'Pooja Bansal',
    rating: 4.3, total_reviews: 49, is_active: true, image_emoji: '🚚',
    createdAt: '2026-01-12T10:00:00Z', updatedAt: '2026-02-22T10:00:00Z',
  },
  {
    id: 's20', title: 'Appliance Installation', description: 'Installation of TV, geyser, chimney, microwave wall mount, and ceiling fan. Includes wiring and testing.',
    category: 'Appliance Repair', price: 600, location: 'Karol Bagh', worker_id: 'w3', worker_name: 'Amar Patel',
    rating: 4.5, total_reviews: 63, is_active: true, image_emoji: '🔌',
    createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-02-25T10:00:00Z',
  },
]

// ===================== DUMMY JOBS =====================
export const dummyJobs = [
  {
    id: 'j1', title: 'Senior React Developer', company: 'TechVista Solutions', location: 'Connaught Place',
    type: 'Full-time', employment_type: 'full_time', salary_min: 1200000, salary_max: 1800000,
    description: 'Build modern web applications using React, Node.js, and cloud technologies. 3+ years experience required.',
    skills_required: ['React', 'Node.js', 'TypeScript', 'AWS'], is_active: true,
    employer_id: 'e1', posted_by: 'TechVista HR',
    createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'j2', title: 'UI/UX Designer', company: 'DesignCraft Studio', location: 'Hauz Khas',
    type: 'Full-time', employment_type: 'full_time', salary_min: 800000, salary_max: 1400000,
    description: 'Design user-centered interfaces for web and mobile products. Figma and prototyping skills required.',
    skills_required: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'], is_active: true,
    employer_id: 'e2', posted_by: 'DesignCraft HR',
    createdAt: '2026-01-08T10:00:00Z', updatedAt: '2026-01-08T10:00:00Z',
  },
  {
    id: 'j3', title: 'Python Backend Developer', company: 'DataFlow Inc.', location: 'Noida Sector 62',
    type: 'Full-time', employment_type: 'full_time', salary_min: 1000000, salary_max: 1600000,
    description: 'Develop APIs and microservices using Python, FastAPI, and PostgreSQL. DevOps experience a plus.',
    skills_required: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'], is_active: true,
    employer_id: 'e3', posted_by: 'DataFlow HR',
    createdAt: '2026-01-05T10:00:00Z', updatedAt: '2026-01-05T10:00:00Z',
  },
  {
    id: 'j4', title: 'Digital Marketing Manager', company: 'GrowthPulse Media', location: 'Khan Market',
    type: 'Full-time', employment_type: 'full_time', salary_min: 900000, salary_max: 1500000,
    description: 'Lead digital marketing strategies and campaigns for growing D2C brands across Delhi NCR.',
    skills_required: ['SEO', 'SEM', 'Social Media', 'Analytics'], is_active: true,
    employer_id: 'e4', posted_by: 'GrowthPulse HR',
    createdAt: '2026-01-03T10:00:00Z', updatedAt: '2026-01-03T10:00:00Z',
  },
  {
    id: 'j5', title: 'DevOps Engineer', company: 'CloudNine Systems', location: 'Gurgaon Cyber City',
    type: 'Full-time', employment_type: 'full_time', salary_min: 1400000, salary_max: 2200000,
    description: 'Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure on AWS/GCP.',
    skills_required: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'], is_active: true,
    employer_id: 'e5', posted_by: 'CloudNine HR',
    createdAt: '2026-01-12T10:00:00Z', updatedAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'j6', title: 'Data Analyst', company: 'InsightEdge Analytics', location: 'Noida Sector 15',
    type: 'Full-time', employment_type: 'full_time', salary_min: 600000, salary_max: 1000000,
    description: 'Analyze large datasets, create dashboards, and generate actionable business insights.',
    skills_required: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics'], is_active: true,
    employer_id: 'e6', posted_by: 'InsightEdge HR',
    createdAt: '2026-01-14T10:00:00Z', updatedAt: '2026-01-14T10:00:00Z',
  },
  {
    id: 'j7', title: 'Content Writer', company: 'WordSmith Media', location: 'Defence Colony',
    type: 'Part-time', employment_type: 'part_time', salary_min: 300000, salary_max: 600000,
    description: 'Write engaging blog posts, website copy, and social media content for tech and lifestyle brands.',
    skills_required: ['Content Writing', 'SEO Writing', 'Copywriting', 'Research'], is_active: true,
    employer_id: 'e7', posted_by: 'WordSmith HR',
    createdAt: '2026-01-16T10:00:00Z', updatedAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'j8', title: 'Product Manager', company: 'FinServe Technologies', location: 'Golf Course Road',
    type: 'Full-time', employment_type: 'full_time', salary_min: 1800000, salary_max: 2800000,
    description: 'Own the product roadmap for our fintech SaaS platform. Drive strategy, prioritization, and GTM.',
    skills_required: ['Product Strategy', 'Agile', 'Data Analysis', 'UX Principles'], is_active: true,
    employer_id: 'e8', posted_by: 'FinServe HR',
    createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-01-18T10:00:00Z',
  },
]

// ===================== DUMMY GIGS =====================
export const dummyGigs = [
  {
    id: 'g1', title: 'Build a Landing Page', description: 'Need a responsive landing page built with React and Tailwind CSS. Must be mobile-first.',
    budget: 15000, category: 'Web Development', skills: ['React', 'Tailwind CSS', 'Responsive Design'],
    status: 'active', employer_id: 'e1', location: 'Connaught Place',
    createdAt: '2026-01-12T10:00:00Z', updatedAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'g2', title: 'Logo Design for Startup', description: 'Design a modern, minimal logo for a tech startup. Deliverables: PNG, SVG, and brand guidelines.',
    budget: 5000, category: 'Graphic Design', skills: ['Logo Design', 'Branding', 'Illustrator'],
    status: 'active', employer_id: 'e2', location: 'Hauz Khas',
    createdAt: '2026-01-11T10:00:00Z', updatedAt: '2026-01-11T10:00:00Z',
  },
  {
    id: 'g3', title: 'Social Media Content (30 Days)', description: 'Create 30 days of social media content for Instagram and LinkedIn. Graphics + captions.',
    budget: 20000, category: 'Digital Marketing', skills: ['Content Writing', 'Social Media', 'Canva'],
    status: 'active', employer_id: 'e3', location: 'Khan Market',
    createdAt: '2026-01-09T10:00:00Z', updatedAt: '2026-01-09T10:00:00Z',
  },
  {
    id: 'g4', title: 'Mobile App Testing', description: 'QA testing for an Android/iOS app. Write test cases, find bugs, and report with screenshots.',
    budget: 8000, category: 'QA Testing', skills: ['Manual Testing', 'Bug Reporting', 'Mobile'],
    status: 'active', employer_id: 'e4', location: 'Noida Sector 62',
    createdAt: '2026-01-07T10:00:00Z', updatedAt: '2026-01-07T10:00:00Z',
  },
  {
    id: 'g5', title: 'Product Photography (50 items)', description: 'Professional product photography for an e-commerce store. White background, lifestyle shots.',
    budget: 12000, category: 'Photography', skills: ['Product Photography', 'Photo Editing', 'Lightroom'],
    status: 'active', employer_id: 'e5', location: 'Rajouri Garden',
    createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'g6', title: 'WordPress E-commerce Site', description: 'Set up a WooCommerce store with payment gateway, 50 products, and responsive theme.',
    budget: 25000, category: 'Web Development', skills: ['WordPress', 'WooCommerce', 'PHP'],
    status: 'active', employer_id: 'e6', location: 'Dwarka',
    createdAt: '2026-01-17T10:00:00Z', updatedAt: '2026-01-17T10:00:00Z',
  },
  {
    id: 'g7', title: 'SEO Audit & Optimization', description: 'Complete SEO audit for a SaaS website. On-page optimization, keyword research, and backlink strategy.',
    budget: 10000, category: 'Digital Marketing', skills: ['SEO', 'Google Analytics', 'Ahrefs'],
    status: 'active', employer_id: 'e7', location: 'Gurgaon Cyber City',
    createdAt: '2026-01-19T10:00:00Z', updatedAt: '2026-01-19T10:00:00Z',
  },
  {
    id: 'g8', title: 'Data Entry (1000 Records)', description: 'Enter product data from PDF catalogs into Excel/Google Sheets. Must be accurate and formatted.',
    budget: 3000, category: 'Data Entry', skills: ['Data Entry', 'Excel', 'Google Sheets'],
    status: 'active', employer_id: 'e8', location: 'Chandni Chowk',
    createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-01-20T10:00:00Z',
  },
]

// ===================== DUMMY REVIEWS =====================
export const dummyReviews = [
  {
    id: 'r1', booking_id: 'b1', service_id: 's1', customer_id: 'c1', worker_id: 'w2',
    customer_name: 'Priya Sharma', service_title: 'Professional Home Cleaning', service_type: 'Home Cleaning',
    rating: 5, comment: 'Absolutely spotless! Priya did an amazing job with the deep cleaning. My apartment looks brand new. Highly recommended!',
    tags: ['Professional', 'On Time', 'Great Value'], createdAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'r2', booking_id: 'b2', service_id: 's2', customer_id: 'c2', worker_id: 'w1',
    customer_name: 'Rahul Mehta', service_title: 'Plumbing & Pipe Repair', service_type: 'Plumber',
    rating: 5, comment: 'Rajesh fixed a major leak in under an hour. Very professional and explained everything clearly. Fair pricing too.',
    tags: ['Expert', 'Quick Service'], createdAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'r3', booking_id: 'b3', service_id: 's3', customer_id: 'c3', worker_id: 'w3',
    customer_name: 'Anita Desai', service_title: 'Electrical Wiring & Repair', service_type: 'Electrician',
    rating: 5, comment: 'Got my entire house rewired. Amar and his team were incredibly thorough and safety-conscious. Excellent work!',
    tags: ['Professional', 'Safety First', 'Thorough'], createdAt: '2026-01-14T10:00:00Z',
  },
  {
    id: 'r4', booking_id: 'b4', service_id: 's4', customer_id: 'c4', worker_id: 'w4',
    customer_name: 'Deepak Verma', service_title: 'Interior & Exterior Painting', service_type: 'Painter',
    rating: 4, comment: 'Good painting work overall. The texture finish on the accent wall looks beautiful. Took a bit longer than expected but worth it.',
    tags: ['Good Quality', 'Creative'], createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'r5', booking_id: 'b5', service_id: 's5', customer_id: 'c5', worker_id: 'w5',
    customer_name: 'Sneha Iyer', service_title: 'Custom Furniture & Carpentry', service_type: 'Carpenter',
    rating: 5, comment: 'Vikram built a custom bookshelf and study table for my home office. The craftsmanship is outstanding. Will definitely hire again.',
    tags: ['Skilled', 'Creative', 'Professional'], createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'r6', booking_id: 'b6', service_id: 's6', customer_id: 'c6', worker_id: 'w6',
    customer_name: 'Amit Tiwari', service_title: 'Housekeeping & Gardening', service_type: 'Housekeeping',
    rating: 5, comment: 'My terrace garden looks magical! Meena has a great eye for design and chose the perfect plants for the space.',
    tags: ['Creative', 'Great Value', 'On Time'], createdAt: '2026-01-08T10:00:00Z',
  },
  {
    id: 'r7', booking_id: 'b7', service_id: 's7', customer_id: 'c7', worker_id: 'w7',
    customer_name: 'Nisha Kapoor', service_title: 'AC Installation & Repair', service_type: 'AC Repair',
    rating: 5, comment: 'Arjun was extremely knowledgeable. He diagnosed the AC issue quickly and the repair cost was very reasonable. Cooling is perfect now!',
    tags: ['Expert', 'Affordable', 'Quick Service'], createdAt: '2026-01-06T10:00:00Z',
  },
  {
    id: 'r8', booking_id: 'b8', service_id: 's8', customer_id: 'c8', worker_id: 'w8',
    customer_name: 'Meera Jain', service_title: 'Salon & Beauty at Home', service_type: 'Salon at Home',
    rating: 5, comment: 'Fatima did my bridal makeup and it was absolutely stunning! She is so talented and patient. All my guests were impressed.',
    tags: ['Talented', 'Patient', 'Professional'], createdAt: '2026-01-04T10:00:00Z',
  },
]

// ===================== DUMMY BOOKINGS (Admin fallback) =====================
export const dummyBookings = [
  {
    id: 'bk1', service_title: 'Professional Home Cleaning', customer_name: 'Priya Sharma', worker_name: 'Priya Singh',
    customer_id: 'c1', worker_id: 'w2', booking_date: '2026-01-20', time_slot: '9:00 AM - 11:00 AM',
    amount: 1500, status: 'completed', payment_status: 'paid', address: 'B-12, Connaught Place, New Delhi',
    createdAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'bk2', service_title: 'Plumbing & Pipe Repair', customer_name: 'Rahul Mehta', worker_name: 'Rajesh Kumar',
    customer_id: 'c2', worker_id: 'w1', booking_date: '2026-01-22', time_slot: '11:00 AM - 1:00 PM',
    amount: 800, status: 'completed', payment_status: 'paid', address: '45, Lajpat Nagar II, New Delhi',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'bk3', service_title: 'AC Installation & Repair', customer_name: 'Nisha Kapoor', worker_name: 'Arjun Reddy',
    customer_id: 'c7', worker_id: 'w7', booking_date: '2026-01-25', time_slot: '2:00 PM - 4:00 PM',
    amount: 1800, status: 'confirmed', payment_status: 'pending', address: 'C-88, Saket, New Delhi',
    createdAt: '2026-01-22T10:00:00Z',
  },
  {
    id: 'bk4', service_title: 'Salon & Beauty at Home', customer_name: 'Meera Jain', worker_name: 'Fatima Khan',
    customer_id: 'c8', worker_id: 'w8', booking_date: '2026-01-28', time_slot: '9:00 AM - 11:00 AM',
    amount: 1500, status: 'in_progress', payment_status: 'paid', address: '23, Khan Market, New Delhi',
    createdAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 'bk5', service_title: 'Pest Control Treatment', customer_name: 'Deepak Verma', worker_name: 'Kavitha Nair',
    customer_id: 'c4', worker_id: 'w10', booking_date: '2026-02-01', time_slot: '11:00 AM - 1:00 PM',
    amount: 2500, status: 'pending', payment_status: 'pending', address: 'A-67, Defence Colony, New Delhi',
    createdAt: '2026-01-28T10:00:00Z',
  },
  {
    id: 'bk6', service_title: 'Mobile Phone Repair', customer_name: 'Sneha Iyer', worker_name: 'Rohit Sharma',
    customer_id: 'c5', worker_id: 'w11', booking_date: '2026-02-03', time_slot: '2:00 PM - 4:00 PM',
    amount: 500, status: 'cancelled', payment_status: 'refunded', address: '34, Chandni Chowk, Old Delhi',
    createdAt: '2026-01-30T10:00:00Z',
  },
]

// ===================== DUMMY USERS (Admin fallback) =====================
export const dummyUsers = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya.sharma@example.com', user_type: 'customer', location: 'Connaught Place', phone: '+91 91234 56701', suspended: false, createdAt: '2025-11-01T10:00:00Z' },
  { id: 'c2', name: 'Rahul Mehta', email: 'rahul.mehta@example.com', user_type: 'customer', location: 'Lajpat Nagar', phone: '+91 91234 56702', suspended: false, createdAt: '2025-11-05T10:00:00Z' },
  { id: 'c3', name: 'Anita Desai', email: 'anita.desai@example.com', user_type: 'customer', location: 'Karol Bagh', phone: '+91 91234 56703', suspended: false, createdAt: '2025-11-10T10:00:00Z' },
  { id: 'c4', name: 'Deepak Verma', email: 'deepak.verma@example.com', user_type: 'customer', location: 'Defence Colony', phone: '+91 91234 56704', suspended: false, createdAt: '2025-11-15T10:00:00Z' },
  { id: 'c5', name: 'Sneha Iyer', email: 'sneha.iyer@example.com', user_type: 'customer', location: 'Dwarka', phone: '+91 91234 56705', suspended: false, createdAt: '2025-11-20T10:00:00Z' },
  { id: 'w1', name: 'Rajesh Kumar', email: 'rajesh@example.com', user_type: 'worker', location: 'Lajpat Nagar', phone: '+91 98765 43210', suspended: false, createdAt: '2025-10-01T10:00:00Z' },
  { id: 'w2', name: 'Priya Singh', email: 'priya@example.com', user_type: 'worker', location: 'Connaught Place', phone: '+91 98765 43211', suspended: false, createdAt: '2025-10-05T10:00:00Z' },
  { id: 'w3', name: 'Amar Patel', email: 'amar@example.com', user_type: 'worker', location: 'Karol Bagh', phone: '+91 98765 43212', suspended: false, createdAt: '2025-10-10T10:00:00Z' },
  { id: 'e1', name: 'TechVista HR', email: 'hr@techvista.com', user_type: 'employer', location: 'Connaught Place', phone: '+91 11 4000 1001', suspended: false, createdAt: '2025-09-01T10:00:00Z' },
  { id: 'e2', name: 'DesignCraft HR', email: 'hr@designcraft.com', user_type: 'employer', location: 'Hauz Khas', phone: '+91 11 4000 1002', suspended: false, createdAt: '2025-09-05T10:00:00Z' },
]

// ===================== CONSTANTS =====================
export const TIME_SLOTS = [
  { id: 'slot-1', label: '9:00 AM – 11:00 AM', value: '9:00 AM - 11:00 AM' },
  { id: 'slot-2', label: '11:00 AM – 1:00 PM', value: '11:00 AM - 1:00 PM' },
  { id: 'slot-3', label: '2:00 PM – 4:00 PM', value: '2:00 PM - 4:00 PM' },
]

export const BOOKING_STATUSES = [
  { key: 'requested', label: 'Requested', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'accepted', label: 'Accepted', color: 'bg-blue-100 text-blue-800' },
  { key: 'on_the_way', label: 'On the Way', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  { key: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { key: 'reviewed', label: 'Reviewed', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
]

// ===================== UTILITIES =====================

// Worker matching formula (deterministic, no AI/ML)
export function calculateWorkerScore(worker, maxDistance = 15) {
  const rating = worker.rating || 0
  const experience = worker.experience_years || 0
  const distance = worker.distance || maxDistance
  const completionRate = worker.completion_rate || 100

  const ratingScore = (rating / 5.0) * 0.35 * 100
  const experienceScore = Math.min(experience / 10.0, 1.0) * 0.25 * 100
  const distanceScore = (1 - Math.min(distance / maxDistance, 1.0)) * 0.20 * 100
  const completionScore = (completionRate / 100.0) * 0.20 * 100

  return Math.round((ratingScore + experienceScore + distanceScore + completionScore) * 100) / 100
}

export function formatCurrencyINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatSalaryRange(min, max) {
  const fmt = v => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(v % 100000 === 0 ? 0 : 1)}L`
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`
    return `₹${v}`
  }
  return `${fmt(min)} – ${fmt(max)} /yr`
}
