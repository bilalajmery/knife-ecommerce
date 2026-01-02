import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { generateVerificationEmail } from "@/email-templates/verification";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "EMAIL",
      emailVerification: false,
      otp,
      otpExpiry,
    });

    // Send OTP Email
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services or SMTP details from env
      auth: {
        user: process.env.EMAIL_USER, // Add these to your .env.local
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"KnifeMaster" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Account - KnifeMaster",
      text: `Welcome to KnifeMaster, ${name}! Your verification code is: ${otp}. It expires in 10 minutes.`,
      html: generateVerificationEmail(otp, name),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // We still return success for signup, but maybe warn about email?
      // Or we could delete the user and fail. For now, let's assume it works or user can resend.
    }

    return NextResponse.json(
      {
        message: "User created successfully. Please verify your email.",
        userId: user._id,
        email: user.email,
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
