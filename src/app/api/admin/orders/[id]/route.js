import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { startAgenda } from "@/lib/agenda";

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

        // Schedule Status Update Email via Agenda (10 seconds delay)
        try {
            const agenda = await startAgenda();
            await agenda.schedule("in 10 seconds", "sendOrderStatusEmail", {
                order: order.toObject(),
                status: status
            });
            console.log(`Order status update email scheduled for ${order.orderId} in 10 seconds`);
        } catch (agendaError) {
            console.error("Agenda Status Scheduling Error:", agendaError);
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
