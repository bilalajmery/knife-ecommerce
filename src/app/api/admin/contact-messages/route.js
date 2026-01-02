import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const status = searchParams.get("status");

        const query = status ? { status } : {};
        const skip = (page - 1) * limit;

        const messages = await ContactMessage.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await ContactMessage.countDocuments(query);

        return NextResponse.json({
            success: true,
            messages,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get contact messages error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

// Mark as read/unread
export async function PATCH(req) {
    try {
        await dbConnect();
        const { messageId, action, adminId } = await req.json();

        if (!messageId || !action) {
            return NextResponse.json(
                { success: false, message: "Message ID and action required" },
                { status: 400 }
            );
        }

        const update =
            action === "read"
                ? { status: "read", readAt: new Date(), readBy: adminId }
                : { status: "unread", readAt: null, readBy: null };

        const message = await ContactMessage.findByIdAndUpdate(messageId, update, {
            new: true,
        });

        if (!message) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Message marked as ${action}`,
            contactMessage: message,
        });
    } catch (error) {
        console.error("Update contact message error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
