import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: false,
  },
  roomImage: {
    type: String,
    required: false,
  },
  participants: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
  usersWhoMutedRoom: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Room", roomSchema);
