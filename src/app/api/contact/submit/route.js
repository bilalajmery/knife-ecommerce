import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        // Create new contact message
        const contactMessage = await ContactMessage.create({
            name,
            email,
            subject,
            message,
        });

        return NextResponse.json({
            success: true,
            message: "Your message has been sent successfully! We'll get back to you soon.",
            contactMessage: {
                id: contactMessage._id,
                name: contactMessage.name,
                email: contactMessage.email,
                subject: contactMessage.subject,
                createdAt: contactMessage.createdAt,
            },
        });
    } catch (error) {
        console.error("Contact form submission error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send message. Please try again." },
            { status: 500 }
        );
    }
}
