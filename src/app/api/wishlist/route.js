import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
        }

        const user = await User.findById(userId).populate({
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
        console.error("Wishlist GET error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const { userId, productId } = await req.json();

        if (!userId || !productId) {
            return NextResponse.json({ success: false, message: "User ID and Product ID required" }, { status: 400 });
        }

        // Add product to wishlist if not already there ($addToSet ensures uniqueness)
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: productId } },
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
        console.error("Wishlist POST error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { userId, productId } = await req.json();

        if (!userId || !productId) {
            return NextResponse.json({ success: false, message: "User ID and Product ID required" }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: productId } },
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
        console.error("Wishlist DELETE error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
