import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, googleId, profile } = await req.json();

    if (!email || !googleId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, check provider
      // Treat missing provider as EMAIL (legacy support)
      if (user.provider === "EMAIL" || !user.provider) {
        return NextResponse.json(
          {
            message: "Account exists. Please enter password.",
            requiresPassword: true,
            email: user.email,
          },
          { status: 200 }
        );
      }

      // If provider is GOOGLE, ensure googleId is linked (it should be if they signed up with google)
      if (user.provider === "GOOGLE") {
        let updated = false;
        if (!user.googleId) {
          user.googleId = googleId;
          updated = true;
        }
        // Update profile if provided and different (or just update to latest)
        if (profile && user.profile !== profile) {
          user.profile = profile;
          updated = true;
        }

        if (updated) {
          await user.save();
        }

        return NextResponse.json(
          {
            message: "User logged in successfully",
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              provider: user.provider,
              profile: user.profile,
            },
          },
          { status: 200 }
        );
      }
    }

    // Create new user if they don't exist
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      googleId,
      profile,
      provider: "GOOGLE",
      emailVerification: true,
    });

    return NextResponse.json(
      {
        message: "User created successfully via Google",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          provider: "GOOGLE",
          profile: user.profile,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
