const Habit = require("../models/Habit");

exports.criarHabito = async (req, res) => {
  const { nome } = req.body;
  const userId = req.userId;
  try {
    const habito = await Habit.create({ nome, usuario: userId });
    res.status(201).json(habito);
  } catch {
    res.status(400).json({ erro: "Erro ao criar hábito." });
  }
};

exports.listarHabitos = async (req, res) => {
  const habitos = await Habit.find({ usuario: req.userId });
  res.json(habitos);
};

exports.concluirHabito = async (req, res) => {
  const habito = await Habit.findOne({ _id: req.params.id, usuario: req.userId });
  if (!habito) return res.status(404).json({ erro: "Hábito não encontrado." });

  habito.diasConcluidos.push(new Date());
  await habito.save();
  res.json(habito);
};

exports.progresso = async (req, res) => {
  const habitos = await Habit.find({ usuario: req.userId });
  const dados = habitos.map(h => ({
    nome: h.nome,
    dias: h.diasConcluidos.length
  }));
  res.json(dados);
};
