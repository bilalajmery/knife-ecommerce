import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Cart from "@/models/Cart";

export async function POST(req) {
    try {
        await dbConnect();
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    appliedPromo: null,
                    discount: 0
                }
            },
            { new: true }
        );

        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Promo removed",
            cart
        });
    } catch (error) {
        console.error("Remove Promo Error:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
