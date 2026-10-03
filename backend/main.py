from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional

from scheduler import solve_timetable

app = FastAPI(
    title="Smart Schedule API",
    description="Python FastAPI backend engine for college timetable generation using Graph Coloring & Backtracking.",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    dataset: Dict[str, Any]
    config: Optional[Dict[str, Any]] = None

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Smart Schedule API Engine", "version": "1.0.0"}

@app.post("/api/generate")
def generate_schedule(req: GenerateRequest):
    try:
        result = solve_timetable(req.dataset, req.config or {})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
