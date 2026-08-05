from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ClinicalAI API",
    description="Backend para suporte à decisão clínica e gestão de prontuários",
    version="0.1.0",
)

# Configuração do CORS para permitir chamadas do Frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API ClinicalAI rodando com sucesso!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}