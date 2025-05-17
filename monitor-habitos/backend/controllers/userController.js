const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, senha } = req.body;
  const hashed = await bcrypt.hash(senha, 10);
  try {
    const user = await User.create({ email, senha: hashed });
    res.status(201).json(user);
  } catch {
    res.status(400).json({ erro: "Erro no cadastro." });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(senha, user.senha)))
    return res.status(401).json({ erro: "Credenciais inválidas." });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};
