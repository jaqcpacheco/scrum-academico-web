import axios from "axios";


function getEnv(customKey, customToken) {
  return {
    key: customKey || process.env.TRELLO_KEY,
    token: customToken || process.env.TRELLO_TOKEN
  };
}

//BUSCAR BOARDS
export async function getBoards(customKey, customToken) {
  try {
    const { key, token } = getEnv(customKey, customToken);

    if (!key || !token) {
      throw new Error("TRELLO_KEY ou TRELLO_TOKEN não definidos");
    }

    const response = await axios.get(
      "https://api.trello.com/1/members/me/boards",
      {
        params: { key, token }
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "❌ Erro ao buscar boards:",
      error.response?.data || error.message
    );

    throw new Error("Erro ao buscar boards do Trello");
  }
}

//BUSCAR DADOS DO BOARD
export async function getBoardData(boardId, customKey, customToken) {
  try {
    const { key, token } = getEnv(customKey, customToken);

    if (!key || !token) {
      throw new Error("TRELLO_KEY ou TRELLO_TOKEN não definidos");
    }

    if (!boardId) {
      throw new Error("BoardId não informado");
    }

    //chamada única otimizada 
    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}`,
      {
        params: {
          key,
          token,
          lists: "open",
          cards: "open",
          members: "all"
        }
      }
    );

    return {
      lists: response.data.lists || [],
      cards: response.data.cards || [],
      members: response.data.members || []
    };

  } catch (error) {
    console.error(
      "🔥 ERRO REAL TREllo:",
      error.response?.data || error.message
    );

    throw new Error("Erro ao buscar dados do Trello");
  }
}