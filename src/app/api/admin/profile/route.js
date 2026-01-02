import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

export async function PUT(req) {
    try {
        await dbConnect();

        // In a real app, I'd get the ID from the session/token. 
        // Since we are using localStorage 'adminUser' on client, we will pass the ID in the body for now.
        // Ideally, this should be protected by middleware verifying a JWT token.

        const body = await req.json();
        const { id, name, email, currentPassword, newPassword } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Admin ID is required" }, { status: 400 });
        }

        const admin = await Admin.findById(id).select("+password");

        if (!admin) {
            return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
        }

        // Update Name & Email
        if (name) admin.name = name;
        if (email) admin.email = email;

        // Update Password if provided
        if (currentPassword && newPassword) {
            const isMatch = await admin.matchPassword(currentPassword);
            if (!isMatch) {
                return NextResponse.json({ success: false, message: "Incorrect current password" }, { status: 400 });
            }
            admin.password = newPassword;
        }

        await admin.save();

        // Return updated user without password
        const updatedAdmin = admin.toObject();
        delete updatedAdmin.password;

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            admin: updatedAdmin
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 });
        }
        return NextResponse.json(
            { success: false, message: "Failed to update profile" },
            { status: 500 }
        );
    }
}
