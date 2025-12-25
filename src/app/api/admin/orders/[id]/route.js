import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const order = await Order.findById(id).populate("user", "name email");

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Admin Order Detail GET Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json({ message: "Status is required" }, { status: 400 });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order,
            message: "Order status updated successfully"
        });
    } catch (error) {
        console.error("Admin Order Update PUT Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
