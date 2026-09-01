const express = require("express");
const cors = require("cors");
const app = express();

const sodasRouter = require("./routes/sodaRouter");

const PORT = process.env.PORT || "3000";

app.use(express.json());
app.use(cors());

app.use("/", sodasRouter);

app.listen(PORT, () => {
  console.log("App escuchando en el puerto 3000!");
});
