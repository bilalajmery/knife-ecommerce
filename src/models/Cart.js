import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    // Snapshot fields to prevent issues if product details change later
    name: String,
    price: Number,
    image: String,
    slug: String,
});

const CartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One cart per user
        },
        items: [CartItemSchema],
        totalPrice: {
            type: Number,
            default: 0,
        },
        appliedPromo: {
            type: String,
            default: null,
        },
        discount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Calculate total price before saving
// Calculate total price before saving
// CartSchema.pre("save", function (next) {
//     this.totalPrice = this.items.reduce(
//         (total, item) => total + item.price * item.quantity,
//         0
//     );
//     next();
// });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
