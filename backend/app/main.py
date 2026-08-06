from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import voices

app = FastAPI(
    title="E.C.H.O. API",
    description="Backend Execution Engine for E.C.H.O. Voice Studio",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voices.router, prefix="/api/voices", tags=["Voices"])

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "engine": "FastAPI (Python)"}
