import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
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
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Delete the model if it exists to prevent "OverwriteModelError" and ensure schema updates
if (mongoose.models.Admin) {
  delete mongoose.models.Admin;
}

export default mongoose.model("Admin", AdminSchema);
