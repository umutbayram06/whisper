import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    return next(new Error("User already exists !"));
  }

  const user = new User({
    username,
    email,
    password, // Model will validate password
  });

  try {
    await user.save();
  } catch (error) {
    error.message =
      "Password must be at least 8 characters long, include at least one special character, one number, one uppercase, and one lowercase letter.";
    return next(error);
  }

  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return next(new Error("Wrong credentials !"));
  }

  const isCorrectPassword = await user.comparePassword(password);

  if (!isCorrectPassword) {
    return next(new Error("Wrong credentials !"));
  }

  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});

export default router;
