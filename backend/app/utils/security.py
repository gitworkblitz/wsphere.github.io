from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..db.firebase import FirebaseDB

security_scheme = HTTPBearer(auto_error=False)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security_scheme)):
    """Verify Firebase JWT token and return user data"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = credentials.credentials
    user_data = await FirebaseDB.verify_token(token)
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return user_data

async def get_optional_user(credentials: HTTPAuthorizationCredentials = Security(security_scheme)):
    """Optional auth - returns None if not authenticated"""
    if not credentials:
        return None
    try:
        token = credentials.credentials
        return await FirebaseDB.verify_token(token)
    except:
        return None
