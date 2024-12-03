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

  await newRoom.populate({
    path: "participants",
    select: "_id username",
  });
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
  const rooms = await Room.find({ participants: userID }).populate({
    path: "participants",
    select: "_id username profileImage about privacySettings",
  });

  // Show profile image or not processing
  const processedRooms = rooms.map((room) => {
    const participants = room.participants.map((participant) => {
      // Include `profileImage` only if `showProfileImage` is true
      const {
        _id,
        username,
        profileImage,
        about,
        privacySettings: { showProfileImage, showAboutSection },
      } = participant;

      const processedParticipant = { _id, username };

      processedParticipant.profileImage = showProfileImage
        ? profileImage
        : "defaultUserImage.png";

      processedParticipant.about = showAboutSection ? about : "";

      return processedParticipant;
    });

    return { ...room.toObject(), participants };
  });

  return processedRooms;
}

export async function isUserInRoom(userID, roomID) {}
