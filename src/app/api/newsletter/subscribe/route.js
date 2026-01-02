import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subscriber from "@/models/Subscriber";

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email });

        if (existing) {
            if (existing.status === "blocked") {
                return NextResponse.json(
                    { success: false, message: "This email has been blocked from subscribing" },
                    { status: 403 }
                );
            }
            return NextResponse.json(
                { success: false, message: "You are already subscribed to our newsletter" },
                { status: 400 }
            );
        }

        // Create new subscriber
        const subscriber = await Subscriber.create({ email });

        return NextResponse.json({
            success: true,
            message: "Successfully subscribed to our newsletter!",
            subscriber: {
                email: subscriber.email,
                subscribedAt: subscriber.subscribedAt,
            },
        });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to subscribe. Please try again." },
            { status: 500 }
        );
    }
}
