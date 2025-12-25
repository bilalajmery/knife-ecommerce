import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Promo from "@/models/Promo";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const {
            userId,
            items,
            shippingAddress,
            paymentMethod,
            total,
            discount,
            appliedPromo,
            paymentId
        } = body;

        // Basic Validation
        if (!items || items.length === 0) {
            return NextResponse.json(
                { message: "No items in order" },
                { status: 400 }
            );
        }

        if (!shippingAddress || !shippingAddress.address) {
            return NextResponse.json(
                { message: "Shipping address is required" },
                { status: 400 }
            );
        }

        // STRICT PROMO CHECK
        if (appliedPromo) {
            const promo = await Promo.findOne({ code: appliedPromo, isActive: true });

            if (!promo) {
                return NextResponse.json(
                    { message: `Promo code ${appliedPromo} is no longer valid.` },
                    { status: 400 }
                );
            }

            if (promo.maxUsage !== -1 && promo.usedCount >= promo.maxUsage) {
                return NextResponse.json(
                    { message: `Promo code ${appliedPromo} usage limit reached.` },
                    { status: 400 }
                );
            }
        }

        // Generate Random 10-digit Order ID
        const orderId = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // Create Order
        const order = await Order.create({
            orderId,
            user: userId || null,
            items,
            shippingAddress,
            paymentMethod,
            paymentId,
            total,
            discount: discount || 0,
            status: "pending",
        });

        // Increment Promo Usage
        if (appliedPromo) {
            await Promo.findOneAndUpdate(
                { code: appliedPromo },
                { $inc: { usedCount: 1 } }
            );
        }

        // Clear User's Cart
        if (userId) {
            await Cart.findOneAndUpdate(
                { user: userId },
                { $set: { items: [], totalPrice: 0, appliedPromo: null, discount: 0 } }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            orderId: orderId, // Return local variable to ensure it exists even if schema is stale
        });
    } catch (error) {
        console.error("Order Creation Error:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
