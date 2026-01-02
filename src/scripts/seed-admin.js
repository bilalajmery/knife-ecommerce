import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from .env.local or .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const seedAdmin = async () => {
  try {
    // Dynamic imports to ensure env vars are loaded first
    const { default: dbConnect } = await import("../lib/db.js");
    const { default: Admin } = await import("../models/Admin.js");

    await dbConnect();
    console.log("Connected to database...");

    const adminEmail = "dummy@example.com";
    const adminPassword = "Admin@123"; // You should change this in production

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const newAdmin = await Admin.create({
      name: "Initial Admin",
      email: adminEmail,
      password: adminPassword,
      status: "active",
    });

    console.log("Admin created successfully:");
    console.log(`Email: ${newAdmin.email}`);
    console.log(`Password: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
