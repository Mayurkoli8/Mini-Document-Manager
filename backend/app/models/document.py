from pydantic import BaseModel
from datetime import datetime

class Document(BaseModel):
    id: str
    title: str
    filename: str
    size: int
    uploaded_at: datetime
