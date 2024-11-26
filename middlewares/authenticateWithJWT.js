import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByID(decoded.userID);
  } catch (err) {
    req.user = null;
    console.log(err);
  }

  next();
};
