import User from "../models/User.js";
import jwt from "jsonwebtoken";

export default async function (socket, next) {
  const authHeader = socket.handshake.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return next(new Error("Unauthorized: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userID);

    if (!user) {
      return next(new Error("Unauthorized: User not found"));
    }

    socket.user = user; // Attach the authenticated user to the socket
    next();
  } catch (err) {
    next(new Error("Forbidden: Invalid or expired token"));
  }
}
