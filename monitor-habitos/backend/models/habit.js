const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diasConcluidos: [{ type: Date }]
});

module.exports = mongoose.model("Habit", HabitSchema);
