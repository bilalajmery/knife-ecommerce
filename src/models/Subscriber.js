import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        status: {
            type: String,
            enum: ["active", "blocked"],
            default: "active",
        },
        subscribedAt: {
            type: Date,
            default: Date.now,
        },
        blockedAt: {
            type: Date,
            default: null,
        },
        blockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
