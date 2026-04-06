from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from .api.services_api import router as services_router
from .api.bookings_api import router as bookings_router
from .api.jobs_api import router as jobs_router
from .api.gigs_api import router as gigs_router
from .api.payments_api import router as payments_router
from .api.invoices_api import router as invoices_router
from .api.workers_api import router as workers_router
from .api.chatbot_api import router as chatbot_router
from .api.admin_api import router as admin_router
from .api.users_api import router as users_router
from .api.tracking_api import router as tracking_router
from .api.reviews_api import router as reviews_router

app = FastAPI(
    title="WorkSphere API",
    version="1.0.0",
    description="Full-stack workforce platform API"
)

# CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Routers
app.include_router(services_router)
app.include_router(bookings_router)
app.include_router(jobs_router)
app.include_router(gigs_router)
app.include_router(payments_router)
app.include_router(invoices_router)
app.include_router(workers_router)
app.include_router(chatbot_router)
app.include_router(admin_router)
app.include_router(users_router)
app.include_router(tracking_router)
app.include_router(reviews_router)

@app.get("/")
async def root():
    return {"message": "WorkSphere API is running 🚀", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "WorkSphere API"}
