import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: function () {
      return this.provider === "EMAIL";
    },
    minlength: [6, "Password cannot be less than 6 characters"],
    select: false, // Do not return password by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  provider: {
    type: String,
    enum: ["EMAIL", "GOOGLE"],
    default: "EMAIL",
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values to be unique (only checks if value exists)
  },
  emailVerification: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    select: false, // Do not return OTP by default
  },
  otpExpiry: {
    type: Date,
    select: false,
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpire: {
    type: Date,
    select: false,
  },
  profile: {
    type: String,
    default: null,
  },
});

// Force model recompilation to ensure schema changes are applied
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", UserSchema);
