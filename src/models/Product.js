import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a product name"],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: false,
        },
        features: {
            type: String,
            required: false,
        },
        specifications: {
            type: String,
            required: false,
        },
        materials: {
            type: String,
            required: false,
        },
        dimensions: {
            type: String,
            required: false,
        },
        usage: {
            type: String,
            required: false,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Please select a category"],
        },
        price: {
            type: Number,
            required: [true, "Please provide a price"],
            min: 0,
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
        },
        mainImage: {
            type: String,
            required: [true, "Main image is required"],
        },
        hoverImage: {
            type: String,
            required: [true, "Hover image is required"],
        },
        galleryImages: {
            type: [String],
            validate: {
                validator: function (v) {
                    return v && v.length >= 2;
                },
                message: "At least 2 gallery images are required",
            },
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        metaTitle: {
            type: String,
            required: false,
        },
        metaDescription: {
            type: String,
            required: false,
        },
        bannedStates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "State",
            },
        ],
    },
    { timestamps: true }
);

// Delete the model from Mongoose cache if it exists to ensure the new schema is used
// Switched to safer pattern for Next.js
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
