import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

// GET: Fetch all admins
export async function GET() {
  try {
    await dbConnect();
    const admins = await Admin.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    return NextResponse.json({ admins }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST: Create a new admin
export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, role, status } = await req.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role,
      status,
    });

    return NextResponse.json(
      { message: "Admin created successfully", admin },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT: Update an admin
export async function PUT(req) {
  try {
    await dbConnect();
    const { id, name, email, role, status, password } = await req.json();

    const admin = await Admin.findById(id);

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.role = role || admin.role;
    admin.status = status || admin.status;

    if (password) {
      admin.password = password;
    }

    await admin.save();

    return NextResponse.json(
      { message: "Admin updated successfully", admin },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE: Delete an admin
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Admin ID required" },
        { status: 400 }
      );
    }

    await Admin.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Admin deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
