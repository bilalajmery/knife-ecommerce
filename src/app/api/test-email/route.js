import { NextResponse } from "next/server";
import { startAgenda } from "@/lib/agenda";
import Order from "@/models/Order";
import dbConnect from "@/lib/db";

export async function GET() {
    try {
        await dbConnect();
        const agenda = await startAgenda();

        // Find the last order to test with
        const order = await Order.findOne().sort({ createdAt: -1 });

        if (!order) {
            return NextResponse.json({ message: "No orders found to test with" });
        }

        await agenda.now("sendOrderEmail", { order: order.toObject() });

        return NextResponse.json({
            message: "Test job triggered NOW. Check your terminal for 'Job started' logs.",
            orderId: order.orderId
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
