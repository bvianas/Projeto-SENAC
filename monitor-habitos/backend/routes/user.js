const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontrollers");
const auth = require("../middleware/middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);

// ✅ NOVA ROTA RESET SENHA (não precisa auth porque é esqueci senha)
router.post("/reset-password", userController.resetPassword);

// ⏰ NOVOS ENDPOINTS DE LEMBRETE
router.get("/lembrete", auth, userController.getLembrete);
router.put("/lembrete", auth, userController.setLembrete);

router.get("/verificar-token", auth, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;

