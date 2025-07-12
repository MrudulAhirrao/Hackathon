from pydantic import BaseModel

class PaperRequest(BaseModel):
    topic: str
    paper_type: str
    paper_format: str