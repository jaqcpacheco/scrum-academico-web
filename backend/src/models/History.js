import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true
  },

  total: Number,
  concluidas: Number,
  emAndamento: Number,
  backlog: Number,

  produtividade: Number, // % de conclusão
  eficiencia: Number,
  wip: Number,
  insight: String,

  porcentagens: {
    concluidas: Number,
    emAndamento: Number,
    backlog: Number
  }

}, {
  timestamps: true
});

export default mongoose.model("History", historySchema);