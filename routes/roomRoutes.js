import express from "express";
import authenticateWithJWT from "../middlewares/authenticateWithJWT.js";
import { createRoom, getMessagesByRoomID } from "../data/room.js";

const router = express.Router();

router.post("/", authenticateWithJWT, async (req, res, next) => {
  const { participantUsernames, roomType, roomName } = req.body;
  const { _id } = req.user;

  if (participantUsernames.length == 0 || !roomType) {
    return next(new Error("Bad parameters !"));
  }

  if (roomType == "group" && !roomName) {
    return next(new Error("Bad parameters"));
  }

  try {
    const newRoom = await createRoom(participantUsernames, roomType, roomName);
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

export default router;
