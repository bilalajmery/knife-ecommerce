import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params; // Handle params safely
        const { slug } = resolvedParams;

        console.log("API Fetching slug:", slug);

        await dbConnect();

        // Log what we are looking for
        console.log(`Searching for product with slug: "${slug}"`);

        const product = await Product.findOne({ slug: slug })
            .populate("category")
            .lean();

        console.log("Product found:", product ? "YES" : "NO");

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { success: false, message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
