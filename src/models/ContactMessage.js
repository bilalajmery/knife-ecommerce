import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["unread", "read"],
            default: "unread",
        },
        readAt: {
            type: Date,
            default: null,
        },
        readBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
