import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

import authenticateSocketWithJWT from "./middlewares/authenticateSocketWithJWT.js";
import errorHandler from "./middlewares/errorHandler.js";
import { getUserByID, getUserRoomsByID } from "./data/user.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { addTextMessageToRoom } from "./data/message.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Allows connections from any origin (use specific origins in production)
    methods: ["GET", "POST"], // Allowing specific HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});
io.use(authenticateSocketWithJWT);

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);

app.use(errorHandler);

// Socket.IO connection setup
io.on("connection", (socket) => {
  const { _id, username } = socket.user;
  console.log("A user connected " + socket.user.username);

  socket.on("initialize", async () => {
    // Retrieve the rooms the user is part of
    const rooms = await getUserRoomsByID(_id);

    // Join all rooms
    rooms.forEach((room) => {
      socket.join(room._id.toString());
      console.log(`${username} (${socket.id}) joined room: ${room._id}`);
    });
  });

  // Receive messages
  socket.on("send-message", async ({ messageData, roomID }) => {
    console.log(roomID);
    console.log(`${message}`);

    messageData.sender = _id;
    const message = await addTextMessageToRoom(messageData, roomID);

    io.to(roomID).emit("receive-message", { message });
  });

  socket.on("send-typing", async ({ roomID }) => {
    const typingUser = await getUserByID(_id);

    io.to(roomID).emit("receive-typing", { typingUser });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT | 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT} `);
});
