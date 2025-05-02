from fastapi import APIRouter, Depends, HTTPException
from firebase_config import db
from pydantic import BaseModel
from typing import Optional
from firebase_admin import auth
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from uuid import uuid4

router = APIRouter()
security = HTTPBearer()

# Modelo de datos
class Preferencia(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    tipo: Optional[str] = "general"

# Verificación del token JWT
async def verificar_token(credenciales: HTTPAuthorizationCredentials = Depends(security)):
    try:
        return auth.verify_id_token(credenciales.credentials)
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

# Crear preferencia
'''@router.post("/usuarios/preferencias/")
def agregar_preferencia(preferencia: Preferencia, usuario=Depends(verificar_token)):
    uid = usuario["uid"]
    id_preferencia = str(uuid4())

    db.collection("Usuarios").document(uid).collection("Preferencias").document(id_preferencia).set(preferencia.dict())
    return {"message": "Preferencia agregada", "id": id_preferencia}

# Obtener todas las preferencias del usuario
@router.get("/usuarios/preferencias/")
def obtener_preferencias(usuario=Depends(verificar_token)):
    uid = usuario["uid"]
    col_ref = db.collection("Usuarios").document(uid).collection("Preferencias")
    docs = col_ref.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]'''


@router.post("/usuarios/preferencias/")
def agregar_preferencia(preferencia: Preferencia):
    uid = "PRUEBA-UID"
    pref_id = str(uuid4())

    db.collection("Usuarios").document(uid).collection("Preferencias").document(pref_id).set(preferencia.dict())
    return {"message": "Preferencia registrada", "id": pref_id}

@router.get("/usuarios/preferencias/")
def listar_preferencias():
    uid = "PRUEBA-UID"
    docs = db.collection("Usuarios").document(uid).collection("Preferencias").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

