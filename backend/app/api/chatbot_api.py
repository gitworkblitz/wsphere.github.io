from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from ..services.chatbot_service import ChatbotService

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

class ChatMessage(BaseModel):
    message: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    response = await ChatbotService.get_response(request.message, request.context)
    return ChatResponse(response=response)
