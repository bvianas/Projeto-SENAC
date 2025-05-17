const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const hashed = await bcrypt.hash(senha, 10);
    const user = await User.create({ email, senha: hashed });
    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso", user });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(400).json({ erro: "Erro ao cadastrar usuário." });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ erro: "Usuário não encontrado." });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: "Erro ao realizar login." });
  }
};