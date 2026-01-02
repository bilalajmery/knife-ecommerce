import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  console.log("Admin Login API hit - v2");
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Check if admin exists
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if active
    if (admin.status !== "active") {
      return NextResponse.json(
        { message: "Your account is inactive" },
        { status: 403 }
      );
    }

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    // Remove password from response
    const adminData = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    return NextResponse.json({
      message: "Login successful",
      admin: adminData,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
