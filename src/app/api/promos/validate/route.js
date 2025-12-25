import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Promo from "@/models/Promo";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function POST(req) {
    try {
        await dbConnect();
        const { code, userId } = await req.json();

        if (!code) {
            return NextResponse.json(
                { valid: false, message: "Code is required" },
                { status: 400 }
            );
        }

        const promo = await Promo.findOne({ code: code.toUpperCase(), isActive: true });

        if (!promo) {
            return NextResponse.json(
                { valid: false, message: "Invalid or expired promo code" },
                { status: 404 }
            );
        }

        // Check usage limits
        if (promo.maxUsage !== -1 && promo.usedCount >= promo.maxUsage) {
            return NextResponse.json(
                { valid: false, message: "Promo limit reached" },
                { status: 400 }
            );
        }

        // Persist to Cart if user is logged in
        let updatedCart = null;
        if (userId) {
            updatedCart = await Cart.findOneAndUpdate(
                { user: userId },
                {
                    $set: {
                        appliedPromo: promo.code,
                        discount: promo.discount
                    }
                },
                { upsert: true, new: true } // Create cart if it doesn't exist, return new doc
            ).populate("items.product"); // Start populating to match GET structure if possible, though GET does it separately usually.
        }

        return NextResponse.json({
            valid: true,
            discount: promo.discount,
            message: `${promo.discount}% discount applied!`,
            cart: updatedCart
        });
    } catch (error) {
        return NextResponse.json(
            { valid: false, message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
