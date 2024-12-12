import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    unique: true,
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
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation using your constraints
        const lengthCheck = value.length >= 8; // Minimum 8 characters
        const specialCharCheck = /[!@#$%^&*(),.?"_:{}|<>]/.test(value); // At least one special character
        const numberCheck = /\d/.test(value); // At least one number
        const upperLowerCheck = /(?=.*[a-z])(?=.*[A-Z])/.test(value); // At least one lowercase and one uppercase letter

        return (
          lengthCheck && specialCharCheck && numberCheck && upperLowerCheck
        );
      },
    },
  },
  profileImage: {
    type: String,
    default: "defaultUserImage.png",
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
    default: () => ({ showProfileImage: true, showAboutSection: true }),
  },
});

// Save user's password after validation
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
