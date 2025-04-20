from fastapi import FastAPI
from firebase_config import db
from pydantic import BaseModel
from typing import Optional
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from rutas import preferencias , historial, agenda,eventos  #estamos incluyendo las preferencias de rutas


app = FastAPI()
#Aqui estamos poniendo todas las rutas
app.include_router(preferencias.router)
app.include_router(historial.router)
app.include_router(agenda.router)
app.include_router(eventos.router)

#para hacer correr el servidor: uvicorn main:app --reload



@app.get("/")
def read_root():
    return {"message": "Bienvenido al backend FastAPI del Bicentenario"}

@app.get("/usuarios/{uid}")
def obtener_usuario(uid: str):
    doc_ref = db.collection("Usuarios").document(uid)
    doc = doc_ref.get()

    if doc.exists:
        return doc.to_dict()
    else:
        return {"error": "Usuario no encontrado"}
    
class Usuario(BaseModel):
    uid: str
    nombre: str
    apellidoPaterno: str
    apellidoMaterno: str
    email: str
    fechaNac: str
    genero: str
    rol: str = "usuario"
    verificado: bool = False


class RegistroAgenda(BaseModel):
    id_evento: Optional[str] = None
    actividad: str
    fecha: str
    comentario: Optional[str] = None
    calificacion: Optional[int] = None

#para verificar el token enviado por el front
security = HTTPBearer()

async def verificar_token(credenciales: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(credenciales.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    
@app.post("/usuarios/")
def crear_usuario(datos: Usuario, usuario=Depends(verificar_token)):
    uid = usuario["uid"]
    doc_ref = db.collection("Usuarios").document(uid)

    if doc_ref.get().exists:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    doc_ref.set(datos.dict())
    return {"message": "Usuario creado correctamente", "uid": uid}




#verificacacion en una ruta protegida usando depends
@app.get("/perfil")
def perfil_usuario(usuario=Depends(verificar_token)):
    return {
        "uid": usuario["uid"],
        "email": usuario["email"],
        "nombre": usuario.get("name", "No especificado")
    }



