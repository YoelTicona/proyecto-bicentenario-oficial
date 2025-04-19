from fastapi import APIRouter, Depends, HTTPException
from firebase_config import db
from pydantic import BaseModel
from firebase_admin import auth
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from uuid import uuid4
from datetime import datetime
from typing import Optional

router = APIRouter()
security = HTTPBearer()

# Token checker
async def verificar_token(credenciales: HTTPAuthorizationCredentials = Depends(security)):
    try:
        return auth.verify_id_token(credenciales.credentials)
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

# Modelo importado desde arriba
class HistorialActividad(BaseModel):
    tipo: str
    descripcion: Optional[str] = None
    fecha: Optional[str] = None

# POST: Registrar una actividad
@router.post("/usuarios/historial/")
def registrar_actividad(actividad: HistorialActividad, usuario=Depends(verificar_token)):
    uid = usuario["uid"]
    id_registro = str(uuid4())

    if not actividad.fecha:
        actividad.fecha = datetime.utcnow().isoformat()

    db.collection("Usuarios").document(uid).collection("HistorialActividades").document(id_registro).set(actividad.dict())
    return {"message": "Actividad registrada", "id": id_registro}

# GET: Listar historial
@router.get("/usuarios/historial/")
def obtener_historial(usuario=Depends(verificar_token)):
    uid = usuario["uid"]
    docs = db.collection("Usuarios").document(uid).collection("HistorialActividades").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]
