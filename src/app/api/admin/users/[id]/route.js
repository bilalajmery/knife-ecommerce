import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import User from "../../../../../models/User";
import Order from "../../../../../models/Order";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    try {
        await connectToDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
        }

        const user = await User.findById(id).select("-password -otp -resetPasswordToken -resetPasswordExpire");

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Get Order Stats
        const orders = await Order.find({ user: id });

        const totalOrders = orders.length;
        const totalSpent = orders.reduce((acc, order) => acc + (order.total || 0), 0);

        // Status wise count
        const statusCounts = orders.reduce((acc, order) => {
            const status = order.status || "pending";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Recent orders (last 5)
        const recentOrders = await Order.find({ user: id })
            .sort({ createdAt: -1 })
            .limit(5);

        return NextResponse.json({
            success: true,
            user,
            stats: {
                totalOrders,
                totalSpent,
                statusCounts
            },
            recentOrders
        });

    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch user details" },
            { status: 500 }
        );
    }
}
