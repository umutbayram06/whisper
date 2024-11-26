import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  emoji: {
    type: String,
  },
});

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  status: [
    {
      type: String,
      enum: ["Sent", "Delivered", "Read"],
    },
  ],
  reactions: [{ type: reactionSchema }],
});

export default mongoose.model("Message", messageSchema);
