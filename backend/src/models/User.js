import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true
    },

    nome: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    photo: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["manager", "member"],
      default: "member"
    },

    trelloConnected: {
      type: Boolean,
      default: false
    },

    trelloToken: {
      type: String,
      default: ""
    },

    trelloKey: {

      type: String,
      default: ""
    },
    
    trelloUsername: {
      type: String,
      default: ""
    }
  },

  {
    timestamps: true
  }
);

export default mongoose.model(
  "User",
  userSchema
);