import mongoose from "mongoose";

const CitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
            required: true,
        },
        state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "State",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Index for faster lookups based on state/country
CitySchema.index({ state: 1 });
CitySchema.index({ country: 1 });

export default mongoose.models.City || mongoose.model("City", CitySchema);
