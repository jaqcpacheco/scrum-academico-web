import User from "../models/User.js";
import { encrypt } from "../utils/crypto.js";

export const loginUser = async (req, res) => {
  try {
    const { uid, nome, email, photo } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ success: false, error: "Dados inválidos" });
    }

    let user = await User.findOne({ $or: [{ uid }, { email }] });

    if (user) {
      if (user.uid !== uid) user.uid = uid;
      user.nome = nome || user.nome;
      user.email = email || user.email;
      user.photo = photo || user.photo;
      await user.save();

      return res.status(200).json({ success: true, user: sanitizeUser(user) });
    }

    user = await User.create({
      uid, nome, email, photo,
      role: "manager",
      trelloConnected: false,
      trelloToken: "",
      trelloKey: "",
      trelloUsername: ""
    });

    return res.status(201).json({ success: true, user: sanitizeUser(user) });

  } catch (error) {
    console.error("ERRO LOGIN:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


export const connectTrello = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ success: false, error: "Dados inválidos" });
    }

    const trelloResponse = await fetch(
      `https://api.trello.com/1/members/me?key=${process.env.TRELLO_KEY}&token=${token}`
    );
    const trelloData = await trelloResponse.json();

    if (!trelloData.id) {
      return res.status(400).json({ success: false, error: "Erro ao autenticar Trello" });
    }

    const encryptedToken = encrypt(token);

    const user = await User.findOneAndUpdate(
      { uid: userId },
      {
        trelloConnected: true,
        trelloToken: encryptedToken,
        trelloKey: process.env.TRELLO_KEY,
        trelloUsername: trelloData.username
      },
      { new: true }
    );

    return res.status(200).json({ success: true, user: sanitizeUser(user) });

  } catch (error) {
    console.error("ERRO TRELLO:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const disconnectTrello = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: userId },
      { trelloConnected: false, trelloToken: "", trelloKey: "", trelloUsername: "" },
      { new: true }
    );

    return res.status(200).json({ success: true, user: sanitizeUser(user) });

  } catch (error) {
    console.error("ERRO DISCONNECT:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

function sanitizeUser(user) {
  const obj = user.toObject();
  delete obj.trelloToken; 
  delete obj.trelloKey;
  return obj;
}
