const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Reemplaza con tu ruta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const eventos = [
  {
    anio: 1825,
    titulo: "Independencia de Bolivia",
    descripcion: "Bolivia declaró su independencia de España el 6 de agosto de 1825, consolidando la República.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Acta_independencia_bolivia_1825.jpg",
    video: "https://www.youtube.com/embed/1NT4mBdMPNs",
    fuente: "https://es.wikipedia.org/wiki/Independencia_de_Bolivia"
  },
  {
    anio: 1952,
    titulo: "Revolución Nacional",
    descripcion: "El MNR tomó el poder y realizó reformas como el voto universal, la nacionalización de minas y la reforma agraria.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Victoria_de_la_revolución_nacional.jpg",
    video: "https://www.youtube.com/embed/txZUzV_CnLk",
    fuente: "https://es.wikipedia.org/wiki/Revoluci%C3%B3n_nacional_boliviana"
  },
  {
    anio: 1967,
    titulo: "Captura y muerte del Che Guevara",
    descripcion: "Ernesto 'Che' Guevara fue capturado y ejecutado en Bolivia durante su intento de iniciar una revolución.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Che_Guevara_dead.jpg",
    video: "https://www.youtube.com/embed/VqDZ3bU73W8",
    fuente: "https://es.wikipedia.org/wiki/Ernesto_Guevara"
  },
  {
    anio: 1982,
    titulo: "Retorno a la democracia",
    descripcion: "Después de gobiernos militares, Bolivia retornó a la democracia con Hernán Siles Zuazo.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Hernan_Siles_Zuazo.jpg",
    video: "https://www.youtube.com/embed/KGePz8BlCBU",
    fuente: "https://es.wikipedia.org/wiki/Hern%C3%A1n_Siles_Zuazo"
  },
  {
    anio: 2006,
    titulo: "Evo Morales asume la presidencia",
    descripcion: "Evo Morales fue el primer presidente indígena de Bolivia, iniciando un proceso de cambio político.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Evo_Morales_2017.jpg",
    video: "https://www.youtube.com/embed/5Zb37GO_H20",
    fuente: "https://es.wikipedia.org/wiki/Evo_Morales"
  },
  {
    anio: 2009,
    titulo: "Nueva Constitución Política del Estado",
    descripcion: "Se promulgó una nueva Constitución que refundó Bolivia como Estado Plurinacional.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Constituci%C3%B3n_Pol%C3%ADtica_del_Estado_de_Bolivia_2009.jpg",
    video: "https://www.youtube.com/embed/IAvCsfPKhsk",
    fuente: "https://es.wikipedia.org/wiki/Constituci%C3%B3n_Pol%C3%ADtica_del_Estado_de_Bolivia_(2009)"
  },
  {
    anio: 2019,
    titulo: "Crisis política y renuncia de Evo Morales",
    descripcion: "Tras denuncias de fraude electoral, Evo Morales renunció y se produjo una crisis institucional.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Protestas_Bolivia_2019.jpg",
    video: "https://www.youtube.com/embed/NNK9zbr7w0o",
    fuente: "https://es.wikipedia.org/wiki/Crisis_pol%C3%ADtica_en_Bolivia_de_2019"
  },
  {
    anio: 2020,
    titulo: "Elección de Luis Arce",
    descripcion: "Luis Arce, del MAS, ganó las elecciones generales con más del 55% de los votos.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Luis_Arce_2020.jpg",
    video: "https://www.youtube.com/embed/KkBzI2JXMH8",
    fuente: "https://es.wikipedia.org/wiki/Luis_Arce"
  },
  {
    anio: 2025,
    titulo: "Bicentenario de Bolivia",
    descripcion: "Bolivia celebrará sus 200 años de independencia con diversos actos culturales, históricos y cívicos.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Bicentenario_Bolivia_logo.png",
    video: "https://www.youtube.com/embed/JoYVquk6fiU",
    fuente: "https://www.boliviabicentenario.bo/"
  },
  {
    anio: 1879,
    titulo: "Guerra del Pacífico",
    descripcion: "Bolivia perdió su salida al mar en la guerra contra Chile, lo que aún es tema diplomático.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/0/08/Batalla_de_Topater.jpg",
    video: "https://www.youtube.com/embed/ZrhD3Zfu6-I",
    fuente: "https://es.wikipedia.org/wiki/Guerra_del_Pac%C3%ADfico"
  }
];

async function subirEventos() {
  const batch = db.batch();

  eventos.forEach(evento => {
    const ref = db.collection("EventosHistoricos").doc();
    batch.set(ref, evento);
  });

  await batch.commit();
  console.log("Eventos históricos subidos exitosamente.");
}

subirEventos();
