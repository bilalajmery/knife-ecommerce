import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Can be null for guest checkout (if supported later), but strictly required if we enforce login
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: String,
                price: Number,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                image: String,
            },
        ],
        shippingAddress: {
            firstName: String,
            lastName: String,
            email: String,
            address: String,
            city: String,
            zip: String,
            country: String,
        },
        paymentMethod: {
            type: String,
            enum: ["cod", "card"],
            default: "cod",
        },
        total: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
