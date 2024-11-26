import mongoose from "mongoose";

const privacySettingsSchema = new mongoose.Schema({
  showProfileImage: {
    type: Boolean,
    default: true,
  },
  showAboutSection: {
    type: Boolean,
    default: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  password: { type: String, required: true },
  profileImage: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
  },
  about: {
    type: String,
    maxlength: 300,
    default: "I am using Whisper!",
  },
  status: {
    type: String,
    enum: ["Online", "Offline"],
    default: "Online",
  },
  blockedUsers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  privacySettings: {
    type: privacySettingsSchema,
  },
  rooms: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Room",
    },
  ],
});

export default mongoose.model("User", userSchema);
