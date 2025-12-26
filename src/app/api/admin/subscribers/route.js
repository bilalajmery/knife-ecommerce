import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subscriber from "@/models/Subscriber";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const status = searchParams.get("status");

        const query = status ? { status } : {};
        const skip = (page - 1) * limit;

        const subscribers = await Subscriber.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Subscriber.countDocuments(query);

        return NextResponse.json({
            success: true,
            subscribers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get subscribers error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

// Block/Unblock subscriber
export async function PATCH(req) {
    try {
        await dbConnect();
        const { subscriberId, action, adminId } = await req.json();

        if (!subscriberId || !action) {
            return NextResponse.json(
                { success: false, message: "Subscriber ID and action required" },
                { status: 400 }
            );
        }

        const update =
            action === "block"
                ? { status: "blocked", blockedAt: new Date(), blockedBy: adminId }
                : { status: "active", blockedAt: null, blockedBy: null };

        const subscriber = await Subscriber.findByIdAndUpdate(
            subscriberId,
            update,
            { new: true }
        );

        if (!subscriber) {
            return NextResponse.json(
                { success: false, message: "Subscriber not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Subscriber ${action === "block" ? "blocked" : "unblocked"} successfully`,
            subscriber,
        });
    } catch (error) {
        console.error("Update subscriber error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
