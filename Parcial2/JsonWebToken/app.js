const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname}/.env` });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (username !== process.env.AUTH_USER || password !== process.env.AUTH_PASSWORD) {
    return res.status(401).json({ message: "Credenciales incorrectas." });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

function authenticateToken(req, res, next) {
  const token = req.get("Authorization")?.match(/^Bearer\s+(\S+)$/i)?.[1];

  jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (err, user) => {
    if (err) return res.status(401).json({ message: "Token inválido." });
    req.user = user;
    next();
  });
}

app.get("/test", authenticateToken, (req, res) => {
  res.json({ message: "Hola Mundo!", username: req.user.username });
});

app.listen(PORT, () => {
  console.log(`App escuchando en el puerto ${PORT}!`);
});
