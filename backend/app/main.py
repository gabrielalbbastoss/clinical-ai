from fastapi import FastAPI

app = FastAPI(
    title="ClinicalAI API",
    description="Backend para suporte à decisão clínica e gestão de prontuários",
    version="0.1.0",
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API ClinicalAI rodando com sucesso!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}