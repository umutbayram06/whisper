import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: false,
  },
  roomType: {
    type: String,
    enum: ["private", "group"],
    required: true,
  },
  roomImage: {
    type: String,
    required: false,
    default: "defaultGroupRoomImage.jpg",
  },
  participants: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
    default: [],
  },
  usersWhoMutedRoom: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
});

export default mongoose.model("Room", roomSchema);
