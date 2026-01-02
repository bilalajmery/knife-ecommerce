import mongoose from "mongoose";

const PromoSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        maxUsage: {
            type: Number,
            default: 1, // 1 means it can only be used once
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ["active", "used"],
            default: "active",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Promo || mongoose.model("Promo", PromoSchema);
