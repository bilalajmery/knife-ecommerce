import mongoose from "mongoose";

const StateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            maxLength: 10,
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Compound index to ensure unique state codes per country
StateSchema.index({ country: 1, code: 1 }, { unique: true });

export default mongoose.models.State || mongoose.model("State", StateSchema);
