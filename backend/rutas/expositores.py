from fastapi import APIRouter, Depends, HTTPException
from firebase_config import db
from pydantic import BaseModel
from uuid import uuid4
from typing import Optional

router = APIRouter()

class Expositor(BaseModel):
    nombre: str
    especialidad: Optional[str] = None
    institucion: Optional[str] = None
    contacto: Optional[str] = None

# POST: Agregar expositor a un evento
'''@router.post("/eventos/{evento_id}/expositores/")
def agregar_expositor(evento_id: str, expositor: Expositor):
    expositor_id = str(uuid4())
    evento_ref = db.collection("Eventos").document(evento_id)

    if not evento_ref.get().exists:
        raise HTTPException(status_code=404, detail="Evento no encontrado")

    evento_ref.collection("Expositores").document(expositor_id).set(expositor.dict())
    return {"message": "Expositor agregado", "id": expositor_id}

# GET: Listar expositores de un evento
@router.get("/eventos/{evento_id}/expositores/")
def listar_expositores(evento_id: str):
    evento_ref = db.collection("Eventos").document(evento_id)

    if not evento_ref.get().exists:
        raise HTTPException(status_code=404, detail="Evento no encontrado")

    docs = evento_ref.collection("Expositores").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]'''
@router.post("/eventos/{evento_id}/expositores/")
def agregar_expositor(evento_id: str, expositor: Expositor):
    expositor_id = str(uuid4())
    evento_ref = db.collection("Eventos").document(evento_id)

    if not evento_ref.get().exists:
        raise HTTPException(status_code=404, detail="Evento no encontrado")

    evento_ref.collection("Expositores").document(expositor_id).set(expositor.dict())
    return {"message": "Expositor agregado", "id": expositor_id}

@router.get("/eventos/{evento_id}/expositores/")
def listar_expositores(evento_id: str):
    evento_ref = db.collection("Eventos").document(evento_id)

    if not evento_ref.get().exists:
        raise HTTPException(status_code=404, detail="Evento no encontrado")

    docs = evento_ref.collection("Expositores").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

