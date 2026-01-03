import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Country from "@/models/Country";
import State from "@/models/State";
import City from "@/models/City";

export async function GET(req) {
    try {
        await dbConnect();

        // Fetch orders with populated product details if needed, 
        // though the Order model might already have snapshot info.
        // We'll sort by newest first.
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate("user", "name email");

        return NextResponse.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Admin Orders GET Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
