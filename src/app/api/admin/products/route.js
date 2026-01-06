import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category"; // Ensure Category is registered
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

// Helper to create slug
const createSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") + "-" + Date.now().toString().slice(-4);
};

// Helper to create SKU
const createSKU = (name, categoryName) => {
    const prefix = name.slice(0, 3).toUpperCase();
    const catPrefix = categoryName ? categoryName.slice(0, 3).toUpperCase() : "GEN";
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${catPrefix}-${prefix}-${random}`;
};

// Helper to save file
const saveFile = async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "_" + file.name.replace(/ /g, "_");
    const uploadDir = path.join(process.cwd(), "public/uploads/products");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/products/${filename}`;
};

// GET: Fetch all products
export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        let query = {};

        if (category && category !== "all") {
            query.category = category;
        }

        if (status && status !== "all") {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } },
            ];
        }

        const products = await Product.find(query)
            .populate("category", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(req) {
    try {
        await dbConnect();

        const formData = await req.formData();

        // Extract textual data
        const name = formData.get("name");
        const categoryId = formData.get("category");
        const price = formData.get("price");
        const discount = formData.get("discount");
        const description = formData.get("description");
        const features = formData.get("features");
        const specifications = formData.get("specifications");
        const materials = formData.get("materials");
        const dimensions = formData.get("dimensions");
        const usage = formData.get("usage");
        const status = formData.get("status");
        const metaTitle = formData.get("metaTitle");
        const metaDescription = formData.get("metaDescription");

        // Extract files
        const mainImageFile = formData.get("mainImage");
        const hoverImageFile = formData.get("hoverImage");
        const galleryImageFiles = formData.getAll("galleryImages");

        // Validations
        if (!name || !categoryId || !price || !mainImageFile || !hoverImageFile) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (galleryImageFiles.length < 2) {
            return NextResponse.json({ message: "At least 2 gallery images are required" }, { status: 400 });
        }

        // Save Images
        const mainImageUrl = await saveFile(mainImageFile);
        const hoverImageUrl = await saveFile(hoverImageFile);

        const galleryImages = [];
        for (const file of galleryImageFiles) {
            const url = await saveFile(file);
            galleryImages.push(url);
        }

        const slug = createSlug(name);
        const categoryDoc = await Category.findById(categoryId);
        const sku = createSKU(name, categoryDoc ? categoryDoc.name : "UNK");

        const product = await Product.create({
            name,
            slug,
            sku,
            description,
            features,
            specifications,
            materials,
            dimensions,
            usage,
            category: categoryId,
            price,
            discount,
            status,
            metaTitle,
            metaDescription,
            mainImage: mainImageUrl,
            hoverImage: hoverImageUrl,
            galleryImages: galleryImages,
        });

        return NextResponse.json(
            { message: "Product created successfully", product },
            { status: 201 }
        );

    } catch (error) {
        fs.appendFileSync(path.join(process.cwd(), 'debug.log'), `Error: ${error.message}\n${error.stack}\n`);
        console.error("Error creating product:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
