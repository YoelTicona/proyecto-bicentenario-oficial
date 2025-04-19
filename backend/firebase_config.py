import firebase_admin
from firebase_admin import credentials, firestore

# Aquí va el nombre exacto del archivo que descargaste o renombraste
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
