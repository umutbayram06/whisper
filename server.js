import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

// Routes
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

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

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorHandler);

// Socket.IO connection setup
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT | 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT} `);
});
