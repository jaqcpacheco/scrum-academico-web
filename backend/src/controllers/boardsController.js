import User from "../models/User.js";

import {
  getBoards
} from "../services/trelloService.js";

export async function fetchBoards(
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

    const user =
      await User.findOne({

        uid: userId
      });

    if (!user) {

      return res.status(404).json({

        success: false,

        error:
          "Usuário não encontrado"
      });
    }


    if (
      !user.trelloKey ||
      !user.trelloToken
    ) {

      return res.status(400).json({

        success: false,

        error:
          "Usuário sem Trello conectado"
      });
    }

    const boards =
      await getBoards(

        user.trelloKey,

        user.trelloToken
      );

    return res.json({

      success: true,

      data:
        Array.isArray(boards)
          ? boards
          : []
    });

  } catch (err) {

    console.error(
      "Erro ao buscar boards:",
      err.message
    );

    return res.status(500).json({

      success: false,

      error:
        "Erro ao buscar boards"
    });

  }
}