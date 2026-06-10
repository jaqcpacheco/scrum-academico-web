import crypto from "crypto";
import Invite from "../models/Invite.js";
import User from "../models/User.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export async function generateInvite(req, res) {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ uid: userId });

    if (!user || user.role !== "manager") {
      return res.status(403).json({
        success: false,
        error: "Apenas Scrum Masters podem gerar convites"
      });
    }


    const code = crypto.randomBytes(16).toString("hex");


    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await Invite.create({
      createdBy: userId,
      code,
      expiresAt
    });

    const link = `${FRONTEND_URL}/invite/${invite.code}`;

    return res.status(201).json({
      success: true,
      link,
      code: invite.code,
      expiresAt: invite.expiresAt
    });

  } catch (error) {
    console.error(" ERRO GENERATE INVITE:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function validateInvite(req, res) {
  try {
    const { code } = req.params;

    const invite = await Invite.findOne({ code });

    if (!invite) {
      return res.status(404).json({ success: false, error: "Convite inválido" });
    }

    if (invite.used) {
      return res.status(400).json({ success: false, error: "Convite já utilizado" });
    }

    if (new Date() > invite.expiresAt) {
      return res.status(400).json({ success: false, error: "Convite expirado" });
    }

    return res.status(200).json({ success: true, valid: true });

  } catch (error) {
    console.error(" ERRO VALIDATE INVITE:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}


export async function acceptInvite(req, res) {
  try {
    const { code, uid, nome, email, photo } = req.body;

    const invite = await Invite.findOne({ code });

    if (!invite || invite.used || new Date() > invite.expiresAt) {
      return res.status(400).json({ success: false, error: "Convite inválido ou expirado" });
    }


    let user = await User.findOne({ $or: [{ uid }, { email }] });

    if (user) {

      user.role = "member";
      await user.save();
    } else {
      user = await User.create({
        uid,
        nome,
        email,
        photo: photo || "",
        role: "member",
        trelloConnected: false,
        trelloToken: "",
        trelloKey: "",
        trelloUsername: ""
      });
    }


    invite.used = true;
    invite.usedBy = uid;
    await invite.save();

    const obj = user.toObject();
    delete obj.trelloToken;
    delete obj.trelloKey;

    return res.status(200).json({ success: true, user: obj });

  } catch (error) {
    console.error(" ERRO ACCEPT INVITE:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
