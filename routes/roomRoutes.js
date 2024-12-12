import express from "express";
import authenticateWithJWT from "../middlewares/authenticateWithJWT.js";
import {
  createRoom,
  getMessagesByRoomID,
  getRoomsOfUser,
} from "../data/room.js";

import upload from "../middlewares/fileUpload.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", authenticateWithJWT, async (req, res, next) => {
  const { _id } = req.user;

  try {
    const userRooms = await getRoomsOfUser(_id);

    res.json(userRooms);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticateWithJWT, async (req, res, next) => {
  const { participantUsernames, roomType, roomName } = req.body;

  const { _id } = req.user;
  try{
    // Find the logged-in user in the database by their ID
    const user = await User.findById(_id);

    // Check if the logged-in user is in the list of participants
    if (participantUsernames.includes(user.username)) {
      return new Error("You cannot add yourself to the room");
    }
  }catch(error){
    next(error);
  }
  

  if (participantUsernames.length == 0 || !roomType) {
    return next(new Error("Bad parameters !"));
  }

  if (roomType == "group" && !roomName) {
    return next(new Error("Bad parameters"));
  }

  const existingUsers = await User.find(
    { username: { $in: participantUsernames } },
    "username"
  );
  const existingUsernames = existingUsers.map((user) => user.username);
  const missingUsernames = participantUsernames.filter(
    (username) => !existingUsernames.includes(username)
  );
  if (missingUsernames.length > 0) {
    return next(
      new Error(
        `The following usernames do not exist: ${missingUsernames.join(", ")}`
      )
    );
  }

  try {
    const newRoom = await createRoom(
      _id,
      participantUsernames,
      roomType,
      roomName
    );
    res.json({ newRoom });
  } catch (error) {
    next(error);
  }
});

router.get("/:roomID/messages", authenticateWithJWT, async (req, res, next) => {
  const { roomID } = req.params;

  try {
    const messages = await getMessagesByRoomID(roomID);

    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:roomID/roomImage",
  authenticateWithJWT,
  upload.single("file"),
  async (req, res, next) => {
    const { roomID } = req.params;

    try {
      const updatedRoom = await Room.findByIdAndUpdate(
        roomID,
        { roomImage: req.file.filename },
        { new: true }
      );
      res.json({ filename: updatedRoom.roomImage });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
