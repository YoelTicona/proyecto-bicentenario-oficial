from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from firebase_config import db
from uuid import uuid4
from typing import Optional

router = APIRouter()

class Evento(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha: str  # Formato "YYYY-MM-DD"
    hora_inicio: Optional[str] = None  # Ej: "10:00"
    hora_fin: Optional[str] = None     # Ej: "13:00"
    ubicacion: Optional[str] = None
    tipo: Optional[str] = "general"    # Ej: historia, cultura, cívico
    modalidad: Optional[str] = "presencial"  # virtual/presencial
    foto_evento: Optional[str] = None
    costo: Optional[float] = 0.0
    puntuacion: Optional[float] = None  # del 1 al 5

# POST: Crear evento público
'''@router.post("/eventos/")
def crear_evento(evento: Evento):
    evento_id = str(uuid4())
    db.collection("Eventos").document(evento_id).set(evento.dict())
    return {"message": "Evento creado", "id": evento_id}

# GET: Obtener todos los eventos
@router.get("/eventos/")
def listar_eventos():
    docs = db.collection("Eventos").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]'''

@router.post("/eventos/")
def crear_evento(evento: Evento):
    evento_id = str(uuid4())
    db.collection("Eventos").document(evento_id).set(evento.dict())
    return {"message": "Evento creado", "id": evento_id}

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
