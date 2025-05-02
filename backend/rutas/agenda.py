from fastapi import APIRouter, Depends, HTTPException
from firebase_config import db
from firebase_admin import auth
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from uuid import uuid4
from pydantic import BaseModel
from typing import Optional

router = APIRouter()
security = HTTPBearer()




class RegistroAgenda(BaseModel):
    id_evento: Optional[str] = None
    actividad: str
    fecha: str
    comentario: Optional[str] = None
    calificacion: Optional[int] = None

async def verificar_token(credenciales: HTTPAuthorizationCredentials = Depends(security)):
    try:
        return auth.verify_id_token(credenciales.credentials)
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

'''@router.post("/usuarios/agenda/")
def agregar_registro_agenda(registro: RegistroAgenda, usuario=Depends(verificar_token)):
    uid = usuario["uid"]
    agenda_id = str(uuid4())

    db.collection("Usuarios").document(uid).collection("Agenda").document(agenda_id).set(registro.dict())
    return {"message": "Registro de agenda agregado", "id": agenda_id}

@router.get("/usuarios/agenda/")
def obtener_registros_agenda(usuario=Depends(verificar_token)):
    uid = usuario["uid"]
    docs = db.collection("Usuarios").document(uid).collection("Agenda").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]'''
@router.post("/usuarios/agenda/")
def agregar_agenda(registro: RegistroAgenda):
    uid = "PRUEBA-UID"  # Cambia por el UID deseado
    agenda_id = str(uuid4())
    db.collection("Usuarios").document(uid).collection("Agenda").document(agenda_id).set(registro.dict())
    return {"message": "Registro de agenda agregado", "id": agenda_id}

@router.get("/usuarios/agenda/")
def obtener_agenda():
    uid = "PRUEBA-UID"
    docs = db.collection("Usuarios").document(uid).collection("Agenda").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

