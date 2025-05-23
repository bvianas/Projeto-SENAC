const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const path = require("path")
require("dotenv").config();

const userRoutes  = require("./routes/user");
const habitRoutes = require("./routes/habit");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

/* ───────── CORS – permite o front local ───────── */
const allowedOrigins = [
  "http://localhost:3001",
  "http://127.0.0.1:3001"
];
app.use(
  cors({
    origin(origin, cb) {
      // permite Postman (sem Origin) ou origens da lista
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

/* ───────── Middlewares ───────── */
app.use(express.json());

/* ───────── Rotas ───────── */
app.use(userRoutes);
app.use(habitRoutes);

/* ───────── Mongo / Server ───────── */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro ao conectar ao MongoDB", err));

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));


