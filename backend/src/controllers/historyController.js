import History from "../models/History.js";

export async function getHistory(
  req,
  res
) {

  try {

    const { userId } =
      req.query;


    if (!userId) {

      return res.status(400).json({

        success: false,

        error:
          "Usuário não identificado"
      });
    }

    const historico =
      await History.find({

        userId

      })

      .sort({
        createdAt: -1
      });

    return res.json(historico);

  } catch (error) {

    console.error(
      "ERRO HISTORY:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        "Erro ao buscar histórico"
    });

  }
}