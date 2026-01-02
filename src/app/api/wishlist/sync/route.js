import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";

export async function POST(req) {
    try {
        await dbConnect();
        const { userId, productIds } = await req.json();

        if (!userId || !productIds || !Array.isArray(productIds)) {
            return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
        }

        // Merge guest wishlist with user's existing wishlist
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: { $each: productIds } } },
            { new: true }
        ).populate({
            path: "wishlist",
            model: Product,
            select: "name price mainImage hoverImage slug discount originalPrice status"
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error("Wishlist SYNC error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
