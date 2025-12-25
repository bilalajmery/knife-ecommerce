import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Promo from "@/models/Promo";

// GET: List all promos
export async function GET() {
    try {
        await dbConnect();
        const promos = await Promo.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, promos });
    } catch (error) {
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}

// POST: Create a new promo
export async function POST(req) {
    try {
        await dbConnect();
        const { code, discount } = await req.json();

        if (!code || !discount) {
            return NextResponse.json(
                { message: "Code and discount are required" },
                { status: 400 }
            );
        }

        if (discount < 0 || discount > 100) {
            return NextResponse.json(
                { message: "Discount must be between 0 and 100" },
                { status: 400 }
            );
        }

        const existingPromo = await Promo.findOne({ code });
        if (existingPromo) {
            return NextResponse.json(
                { message: "Promo code already exists" },
                { status: 400 }
            );
        }

        const promo = await Promo.create({ code, discount });
        return NextResponse.json({ success: true, promo });
    } catch (error) {
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE: Remove a promo
export async function DELETE(req) {
    try {
        await dbConnect();
        const { id } = await req.json();
        await Promo.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Promo deleted" });
    } catch (error) {
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
