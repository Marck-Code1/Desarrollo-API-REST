const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();





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
