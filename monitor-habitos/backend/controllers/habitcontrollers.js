const Habit = require("../models/Habit");

exports.criarHabito = async (req, res) => {
  const { nome } = req.body;
  const userId = req.userId;

  try {
    const habito = await Habit.create({ nome, usuario: userId });
    res.status(201).json(habito);
  } catch (err) {
    console.error("Erro ao criar hábito:", err);
    res.status(400).json({ erro: "Erro ao criar hábito." });
  }
};

exports.listarHabitos = async (req, res) => {
  try {
    const habitos = await Habit.find({ usuario: req.userId });
    res.json(habitos);
  } catch (err) {
    console.error("Erro ao listar hábitos:", err);
    res.status(500).json({ erro: "Erro ao listar hábitos." });
  }
};

exports.concluirHabito = async (req, res) => {
  try {
    const habito = await Habit.findOne({
      _id: req.params.id,
      usuario: req.userId,
    });

    if (!habito) {
      return res.status(404).json({ erro: "Hábito não encontrado." });
    }

    habito.diasConcluidos.push(new Date());
    await habito.save();
    res.json(habito);
  } catch (err) {
    console.error("Erro ao concluir hábito:", err);
    res.status(500).json({ erro: "Erro ao concluir hábito." });
  }
};

exports.progresso = async (req, res) => {
  try {
    const habitos = await Habit.find({ usuario: req.userId });
    const dados = habitos.map((h) => ({
      nome: h.nome,
      dias: h.diasConcluidos.length,
    }));
    res.json(dados);
  } catch (err) {
    console.error("Erro ao gerar progresso:", err);
    res.status(500).json({ erro: "Erro ao obter progresso." });
  }
};
