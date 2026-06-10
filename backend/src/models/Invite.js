import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
      required: true
    },


    code: {
      type: String,
      required: true,
      unique: true
    },


    used: {
      type: Boolean,
      default: false
    },


    usedBy: {
      type: String,
      default: ""
    },


    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Invite", inviteSchema);
