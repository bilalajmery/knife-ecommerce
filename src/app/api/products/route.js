import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "3", 10);
        const random = searchParams.get("random") === "true";

        const category = searchParams.get("category");
        const exclude = searchParams.get("exclude");

        if (random) {
            // Use MongoDB aggregation to get random samples
            const products = await Product.aggregate([{ $sample: { size: limit } }]);
            return NextResponse.json({ success: true, products });
        }

        // Build query object
        const query = {};
        if (category) {
            query.category = category;
        }
        if (exclude) {
            query._id = { $ne: exclude };
        }

        // Default fetch with filters
        const products = await Product.find(query).limit(limit).populate("category"); // Populate category if needed for UI
        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error("API Product Error:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
