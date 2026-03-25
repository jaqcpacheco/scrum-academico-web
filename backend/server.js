import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const PORT = 3001;


app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

app.get("/teste", (req, res) => {
  res.json({ ok: true });
});
// rota boards
app.get("/boards", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar boards");
  }
});

app.get("/metrics/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;

    const listasRes = await axios.get(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
    );

    const cardsRes = await axios.get(
      `https://api.trello.com/1/boards/${boardId}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
    );

    const listas = listasRes.data;
    const cards = cardsRes.data;

    const listaConcluido = listas.find(l =>
      l.name && ["done", "conclu", "finalizado"].some(p =>
        l.name.toLowerCase().includes(p)
      )
    );

    const listaAndamento = listas.find(l =>
      l.name && ["andamento", "doing", "progress"].some(p =>
        l.name.toLowerCase().includes(p)
      )
    );

    const listaBacklog = listas.find(l =>
      l.name && ["backlog", "to do", "afazer"].some(p =>
        l.name.toLowerCase().includes(p)
      )
    );

  
    const total = cards.length;

    const concluidas = listaConcluido
      ? cards.filter(c => c.idList === listaConcluido.id).length
      : 0;

    const emAndamento = listaAndamento
      ? cards.filter(c => c.idList === listaAndamento.id).length
      : 0;

    const backlog = listaBacklog
      ? cards.filter(c => c.idList === listaBacklog.id).length
      : 0;

    const naoClassificadas = total - (concluidas + emAndamento + backlog);

    const produtividade = total > 0 ? concluidas / total : 0;

    let insight = "";
    if (produtividade > 0.7) {
      insight = "Alta produtividade da equipe.";
    } else if (produtividade > 0.4) {
      insight = "Progresso moderado da equipe.";
    } else {
      insight = "Baixa produtividade, possível atraso.";
    }


    let gargalo = "";
    if (emAndamento > concluidas * 1.5) {
      gargalo = "Alto volume de tarefas em andamento, possível gargalo.";
    } else if (backlog > emAndamento) {
      gargalo = "Muitas tarefas no backlog, possível problema de priorização.";
    } else if (naoClassificadas > 0) {
      gargalo = "Existem tarefas fora do fluxo padrão.";
    } else {
      gargalo = "Fluxo de tarefas equilibrado.";
    }


    res.json({
      total,
      backlog,
      emAndamento,
      concluidas,
      naoClassificadas,
      produtividade: (produtividade * 100).toFixed(1) + "%",
      insight,
      gargalo
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao calcular métricas");
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});