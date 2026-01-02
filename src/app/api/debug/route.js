import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({}, 'name slug status').lean();
        return NextResponse.json({ success: true, count: products.length, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
