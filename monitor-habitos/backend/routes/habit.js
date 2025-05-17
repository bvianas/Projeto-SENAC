const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");
const auth = require("../middleware/auth");

router.post("/habitos", auth, habitController.criarHabito);
router.get("/habitos", auth, habitController.listarHabitos);
router.put("/habitos/:id/concluir", auth, habitController.concluirHabito);
router.get("/progresso", auth, habitController.progresso);

module.exports = router;
