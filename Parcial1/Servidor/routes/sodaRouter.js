const express = require("express");
const router = express.Router();

const sodas = [
  { nombre: "Coca Cola", tipo: "Normal" },
  { nombre: "Pepsi", tipo: "Normal" },
  { nombre: "Manzanita", tipo: "De-Sabor" },
  { nombre: "Fresca", tipo: "De-Sabor" },
  { nombre: "Mirinda", tipo: "De-Sabor" },
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

module.exports = router;
