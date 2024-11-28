import Room from "../models/Room.js";
import { getUsersByUsernames } from "./user.js";

export async function createRoom(
  userIDWhoCreatedRoom,
  participantUsernames,
  roomType,
  roomName
) {
  const participantUsers = await getUsersByUsernames(participantUsernames);
  const participantUserIDs = participantUsers.map((user) => user._id);
  participantUserIDs.push(userIDWhoCreatedRoom);

  const newRoom = new Room({
    roomName: roomType == "group" ? roomName : null,
    roomType: roomType,
    participants: participantUserIDs,
  });

  await newRoom.save();
  return newRoom;
}

export async function getMessagesByRoomID(roomID) {
  // TODO: Check if user in the room

  // Find the room by its ID and populate the messages field with the Message data
  const room = await Room.findById(roomID).populate({
    path: "messages",
    populate: {
      path: "sender",
      model: "User",
      select: "username profileImage",
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  // The messages will be available in the room.messages field
  return room.messages;
}

export async function getRoomsOfUser(userID) {
  const rooms = await Room.find({ participants: userID });

  return rooms;
}

export async function isUserInRoom(userID, roomID) {}
