import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = "WorkSphere"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "./firebase-credentials.json")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "worksphere@gmail.com")
    EMAIL_USER: str = os.getenv("EMAIL_USER", "")
    EMAIL_PASSWORD: str = os.getenv("EMAIL_PASSWORD", "")
    ALLOWED_ORIGINS: list = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

settings = Settings()
