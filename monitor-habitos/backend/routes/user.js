const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontrollers");
const auth = require("../middleware/middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);

// ⏰ NOVOS ENDPOINTS DE LEMBRETE
router.get("/lembrete", auth, userController.getLembrete);
router.put("/lembrete", auth, userController.setLembrete);

module.exports = router;

