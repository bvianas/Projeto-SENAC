const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const habitRoutes = require("./routes/habit");

const app = express();
app.use(cors());
app.use(express.json());

// IMPORTANTE: essas duas linhas devem estar aqui
app.use(userRoutes);
app.use(habitRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Erro ao conectar ao MongoDB", err));

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));