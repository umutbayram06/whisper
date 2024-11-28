import Room from "../models/Room.js";
import User from "../models/User.js";

export async function getUserByID(userID) {
  const user = await User.findById(userID);

  if (!user) {
    throw new Error("User not found !");
  }

  return user;
}

export async function getUserRoomsByID(userID) {
  const userRooms = await Room.find({ participants: userID });

  return userRooms;
}

export async function getUsersByUsernames(usernames) {
  return await User.find({
    username: { $in: usernames },
  });
}
