import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import fs from "fs";

// Helper to save file
const saveFile = async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "_" + file.name.replace(/ /g, "_");
    const uploadDir = path.join(process.cwd(), "public/uploads/products");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/products/${filename}`;
};

// GET: Fetch single product
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params; // Awaiting params for Next.js 15+ compat if needed, safe for 14

        const product = await Product.findById(id).populate("category", "name");

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PUT: Update product
export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const formData = await req.formData();

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Update text fields
        const fields = [
            "name", "category", "price", "discount", "description",
            "features", "specifications", "materials", "dimensions", "usage", "status",
            "metaTitle", "metaDescription"
        ];

        fields.forEach(field => {
            if (formData.has(field)) {
                product[field] = formData.get(field);
            }
        });

        // Handle Images
        const mainImageFile = formData.get("mainImage");
        if (mainImageFile && mainImageFile instanceof File) {
            product.mainImage = await saveFile(mainImageFile);
        }

        const hoverImageFile = formData.get("hoverImage");
        if (hoverImageFile && hoverImageFile instanceof File) {
            product.hoverImage = await saveFile(hoverImageFile);
        }

        // Handle Gallery Images - Strategy: Append new ones or Replace?
        // Implementation: If "galleryImages" are provided, we APPEND them by default or user might clear existing.
        // For specific removal, we'd need a separate mechanism. 
        // Simplified: If "replaceGallery" flag is true, clear old. Else append.
        // Assuming simple append for now or checking if the user wants to clear.
        // Let's rely on frontend sending "resetGallery" flag if they executed a clear.

        if (formData.get("resetGallery") === "true") {
            product.galleryImages = [];
        }

        const galleryFiles = formData.getAll("galleryImages");
        if (galleryFiles.length > 0) {
            for (const file of galleryFiles) {
                if (file instanceof File) {
                    const url = await saveFile(file);
                    product.galleryImages.push(url);
                }
            }
        }

        // Validate Gallery Count
        if (product.galleryImages.length < 2) {
            return NextResponse.json(
                { message: "Product must have at least 2 gallery images. Please upload more." },
                { status: 400 }
            );
        }

        await product.save();

        return NextResponse.json(
            { message: "Product updated successfully", product },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE: Delete product
export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
