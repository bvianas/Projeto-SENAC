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

    // Garante que a data recebida seja interpretada como UTC para evitar fuso quebrando o dia
    const toUtcDate = (dateStr) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(Date.UTC(y, m - 1, d));
    };

    const data = toUtcDate(req.body.data);
    const dataFormatada = data.toISOString().slice(0, 10);

    if (req.method === "PUT") {
      const jaConcluido = habito.diasConcluidos.some(
        (d) => new Date(d).toISOString().slice(0, 10) === dataFormatada
      );
      if (!jaConcluido) {
        habito.diasConcluidos.push(data);
      }
    }

    if (req.method === "DELETE") {
      habito.diasConcluidos = habito.diasConcluidos.filter(
        (d) => new Date(d).toISOString().slice(0, 10) !== dataFormatada
      );
    }

    await habito.save();
    res.json(habito);
  } catch (err) {
    console.error("Erro ao concluir hábito:", err);
    res.status(500).json({ erro: "Erro ao concluir hábito." });
  }
};


exports.desmarcarHabito = async (req, res) => {
  try {
    const habito = await Habit.findOne({
      _id: req.params.id,
      usuario: req.userId,
    });

    if (!habito) {
      return res.status(404).json({ erro: "Hábito não encontrado." });
    }

    const toUtcDate = (dateStr) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(Date.UTC(y, m - 1, d));
    };

    const dataFormatada = toUtcDate(req.body.data).toISOString().slice(0, 10);

    habito.diasConcluidos = habito.diasConcluidos.filter(
      (d) => new Date(d).toISOString().slice(0, 10) !== dataFormatada
    );

    await habito.save();
    res.json(habito);
  } catch (err) {
    console.error("Erro ao desmarcar hábito:", err);
    res.status(500).json({ erro: "Erro ao desmarcar hábito." });
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

exports.totalPontos = async (req, res) => {
  try {
    const habitos = await Habit.find({ usuario: req.userId });
    const total = habitos.reduce((soma, hab) => soma + hab.diasConcluidos.length, 0);
    res.json({ pontos: total });
  } catch (err) {
    console.error("Erro ao calcular pontos:", err);
    res.status(500).json({ erro: "Erro ao calcular pontos." });
  }
};

exports.deletarHabito = async (req, res) => {
  try {
    const habito = await Habit.findOneAndDelete({
      _id: req.params.id,
      usuario: req.userId
    });

    if (!habito) {
      return res.status(404).json({ erro: "Hábito não encontrado." });
    }

    res.json({ mensagem: "Hábito deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar hábito:", err);
    res.status(500).json({ erro: "Erro ao deletar hábito." });
  }
};
