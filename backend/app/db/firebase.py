import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK once
_initialized = False

def initialize_firebase():
    global _initialized
    if not _initialized and not firebase_admin._apps:
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "./firebase-credentials.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # For development without credentials file
            print("WARNING: Firebase credentials file not found. Using mock mode.")
            firebase_admin.initialize_app()
        _initialized = True

initialize_firebase()

try:
    db = firestore.client()
except Exception as e:
    print(f"Firestore init warning: {e}")
    db = None


class FirebaseDB:
    @staticmethod
    async def create_document(collection: str, data: dict, doc_id: str = None) -> str:
        """Create a document in Firestore"""
        try:
            col_ref = db.collection(collection)
            if doc_id:
                col_ref.document(doc_id).set(data)
                return doc_id
            else:
                _, doc_ref = col_ref.add(data)
                return doc_ref.id
        except Exception as e:
            print(f"Error creating document: {e}")
            raise

    @staticmethod
    async def get_document(collection: str, doc_id: str) -> dict:
        """Get a single document"""
        try:
            doc = db.collection(collection).document(doc_id).get()
            if doc.exists:
                return {**doc.to_dict(), "id": doc.id}
            return None
        except Exception as e:
            print(f"Error getting document: {e}")
            return None

    @staticmethod
    async def update_document(collection: str, doc_id: str, data: dict) -> bool:
        """Update a document"""
        try:
            db.collection(collection).document(doc_id).update(data)
            return True
        except Exception as e:
            print(f"Error updating document: {e}")
            return False

    @staticmethod
    async def delete_document(collection: str, doc_id: str) -> bool:
        """Delete a document"""
        try:
            db.collection(collection).document(doc_id).delete()
            return True
        except Exception as e:
            print(f"Error deleting document: {e}")
            return False

    @staticmethod
    async def get_all(collection: str) -> list:
        """Get all documents in a collection"""
        try:
            docs = db.collection(collection).stream()
            return [{**doc.to_dict(), "id": doc.id} for doc in docs]
        except Exception as e:
            print(f"Error getting all documents: {e}")
            return []

    @staticmethod
    async def query_collection(collection: str, field: str, operator: str, value) -> list:
        """Query a collection with a single filter"""
        try:
            docs = db.collection(collection).where(field, operator, value).stream()
            return [{**doc.to_dict(), "id": doc.id} for doc in docs]
        except Exception as e:
            print(f"Error querying collection: {e}")
            return []

    @staticmethod
    async def query_multiple(collection: str, filters: list) -> list:
        """Query with multiple filters: [(field, op, value), ...]"""
        try:
            query = db.collection(collection)
            for field, operator, value in filters:
                query = query.where(field, operator, value)
            docs = query.stream()
            return [{**doc.to_dict(), "id": doc.id} for doc in docs]
        except Exception as e:
            print(f"Error querying collection: {e}")
            return []

    @staticmethod
    async def verify_token(token: str) -> dict:
        """Verify Firebase ID token"""
        try:
            decoded = firebase_auth.verify_id_token(token)
            return decoded
        except Exception as e:
            print(f"Token verification error: {e}")
            return None
