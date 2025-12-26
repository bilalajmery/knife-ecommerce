import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await dbConnect();

        // Get 6 random active categories
        const categories = await Category.aggregate([
            { $match: { status: "active" } },
            { $sample: { size: 6 } }
        ]);

        return NextResponse.json({
            success: true,
            categories: categories.map(cat => ({
                id: cat._id.toString(),
                name: cat.name,
                slug: cat.slug,
                link: `/shop?category=${cat._id.toString()}`
            }))
        });
    } catch (error) {
        console.error("Error fetching random categories:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
