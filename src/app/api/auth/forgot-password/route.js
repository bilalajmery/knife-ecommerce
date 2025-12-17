import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { generateResetPasswordEmail } from "@/email-templates/reset-password";

export async function POST(req) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Please provide an email" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.provider === "GOOGLE") {
      return NextResponse.json(
        {
          message:
            "This account uses Google Sign-In. Please sign in with Google.",
        },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and save to database (optional, but good practice. Here we save plain for simplicity or hashed if we want)
    // For this implementation, I'll save it directly to match the OTP style, but usually we hash it.
    // Let's save it directly for now to ensure it matches easily.
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // Create reset URL
    // Assuming localhost for dev, but should be env var in prod
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/reset-password/${resetToken}`;

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"KnifeMaster" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - KnifeMaster",
      html: generateResetPasswordEmail(resetUrl, user.name),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
