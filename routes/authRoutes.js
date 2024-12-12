import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import authenticateWithJWT from '../middlewares/authenticateWithJWT.js';

const router = express.Router();

//User register
router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    return next(new Error('User already exists !'));
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
      'Password must be at least 8 characters long, include at least one special character, one number, one uppercase, and one lowercase letter.';
    return next(error);
  }

  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});

//User login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return next(new Error('Wrong credentials !'));
  }

  const isCorrectPassword = await user.comparePassword(password);

  if (!isCorrectPassword) {
    return next(new Error('Wrong credentials !'));
  }

  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});
//Change username
router.patch(
  '/change-username',
  authenticateWithJWT,
  async (req, res, next) => {
    const { newUsername } = req.body;

    if (!newUsername) {
      next(new Error('New username not given !'));
    }

    const { _id } = req.user;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { username: newUsername },
        { new: true }
      );

      res.json({ updatedUser });
    } catch (error) {
      if (error.codeName == 'DuplicateKey') {
        error.message =
          'Somebody have already taken this username. Try a different one !';
        return next(error);
      }
      next(error);
    }
  }
);

//Change password
router.patch(
  '/change-password',
  authenticateWithJWT,
  async (req, res, next) => {
    const { newPassword } = req.body;

    if (!newPassword) {
      next(new Error('New password not given !'));
    }

    const { _id } = req.user;

    try {
      const user = await User.findById(_id);
      user.password = newPassword;
      const updatedUser = await user.save();

      res.json({ updatedUser });
    } catch (error) {
      error.message =
        'Password must be at least 8 characters long, include at least one special character, one number, one uppercase, and one lowercase letter.';
      next(error);
    }
  }
);

//Delete account
router.delete(
  '/delete-account',
  authenticateWithJWT,
  async (req, res, next) => {
    const { _id } = req.user;

    try {
      const user = await User.findById(_id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.deleteOne();

      return res
        .status(200)
        .json({ message: 'User account successfully deleted' });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
