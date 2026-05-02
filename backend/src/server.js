import app from "./app.js";
import mongoose from "mongoose";

const PORT = 3001;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB conectado");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Erro ao conectar Mongo:", error.message);
  }
}

startServer();