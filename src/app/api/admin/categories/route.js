import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

// Helper to create slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

// Helper to save file
const saveFile = async (file) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "_" + file.name.replace(/ /g, "_");
  const uploadDir = path.join(process.cwd(), "public/uploads/categories");

  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return `/uploads/categories/${filename}`;
};

// GET: Fetch all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST: Create a new category
export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const status = formData.get("status");
    const metaTitle = formData.get("metaTitle") || "";
    const metaDescription = formData.get("metaDescription") || "";
    const imageFile = formData.get("image");

    console.log("Creating Category - Meta Data:", {
      metaTitle,
      metaDescription,
    });

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category with this name already exists" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (imageFile && imageFile instanceof File) {
      imageUrl = await saveFile(imageFile);
    } else {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    const slug = createSlug(name);

    const category = await Category.create({
      name,
      description,
      image: imageUrl,
      slug,
      status,
      metaTitle,
      metaDescription,
    });

    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT: Update a category
export async function PUT(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const status = formData.get("status");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const imageFile = formData.get("image");

    console.log("Updating Category - Meta Data:", {
      metaTitle,
      metaDescription,
      hasMetaTitle: formData.has("metaTitle"),
      hasMetaDesc: formData.has("metaDescription"),
    });

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return NextResponse.json(
          { message: "Category with this name already exists" },
          { status: 400 }
        );
      }
      category.name = name;
      category.slug = createSlug(name);
    }

    if (formData.has("description")) category.description = description;
    if (formData.has("status")) category.status = status;
    if (formData.has("metaTitle")) category.metaTitle = metaTitle;
    if (formData.has("metaDescription"))
      category.metaDescription = metaDescription;

    if (imageFile && imageFile instanceof File) {
      category.image = await saveFile(imageFile);
    }

    await category.save();

    return NextResponse.json(
      { message: "Category updated successfully", category },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE: Delete a category
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Category ID required" },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
