const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  habitos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
    },
  ],
  lembreteDiario: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", UserSchema);
