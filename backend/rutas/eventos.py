from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from firebase_config import db
from uuid import uuid4
from typing import Optional

router = APIRouter()

class Evento(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha: str
    ubicacion: Optional[str] = None
    tipo: Optional[str] = "general"

# POST: Crear evento público
@router.post("/eventos/")
def crear_evento(evento: Evento):
    evento_id = str(uuid4())
    db.collection("Eventos").document(evento_id).set(evento.dict())
    return {"message": "Evento creado", "id": evento_id}

# GET: Obtener todos los eventos
@router.get("/eventos/")
def listar_eventos():
    docs = db.collection("Eventos").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

# GET: Obtener un evento por ID
@router.get("/eventos/{evento_id}")
def obtener_evento(evento_id: str):
    doc = db.collection("Eventos").document(evento_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return doc.to_dict()
