import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Please provide email and OTP" },
        { status: 400 }
      );
    }

    // Find user with email and matching OTP
    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.emailVerification) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Check if OTP is expired
    if (user.otpExpiry < Date.now()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // Verify user
    user.emailVerification = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          provider: user.provider,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
