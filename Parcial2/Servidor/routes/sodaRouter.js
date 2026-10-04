const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const apiKeyAuth = require('api-key-auth');
 
const app = express();
 
// Create the collection of api keys
const apiKeys = new Map();
apiKeys.set('123456789', {
  id: 1,
  name: 'app1',
  secret: 'secret1'
});
apiKeys.set('987654321', {
  id: 2,
  name: 'app2',
  secret: 'secret2'
});
 
// Your function to get the secret associated to the key id
function getSecret(keyId, done) {
  if (!apiKeys.has(keyId)) {
    return done(new Error('Unknown api key'));
  }
  const clientApp = apiKeys.get(keyId);
  done(null, clientApp.secret, {
    id: clientApp.id,
    name: clientApp.name
  });
}
 
app.use(apiKeyAuth({ getSecret }));
 
app.get('/protected', (req, res) => {
  res.send(`Hello ${req.credentials.name}`);
});
 

const sodas = [
  { nombre: "Coca Cola", tipo: "Normal" },
  { nombre: "Pepsi", tipo: "Normal" },
  { nombre: "Manzanita", tipo: "De-Sabor" },
  { nombre: "Fresca", tipo: "De-Sabor" },
  { nombre: "Mirinda", tipo: "De-Sabor" },
  { nombre: "Doctor Pepper", tipo: "De-Sabor" },
];

router.get("/sodas", (req, res) => {
  const { tipo } = req.query;
  if (tipo) {
    const sodasFiltradas = sodas.filter(
      (soda) => soda.tipo.toLowerCase() === tipo.toLowerCase(),
    );
    return res.json(sodasFiltradas);
  }
  res.json(sodas);
});

router.get("/test", (req, res) => {
  console.log(req.query);
  res.send("Hola Mundo!");
});



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = file.originalname + Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Definición de la ruta
router.post('/subir', upload.single('miArchivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No se subió ningún archivo.' });
  }
  res.status(200).send({ message: 'Archivo recibido', file: req.file.filename });
});







module.exports = router;
