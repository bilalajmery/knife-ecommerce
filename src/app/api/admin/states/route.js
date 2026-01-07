import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import State from "@/models/State";
import Country from "@/models/Country"; // Ensure Country is registered

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const countryId = searchParams.get("country");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;
        const search = searchParams.get("search") || "";

        let query = {};
        if (countryId) {
            query.country = countryId;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } }
            ];
        }

        const [states, total] = await Promise.all([
            State.find(query)
                .populate("country", "name")
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit),
            State.countDocuments(query)
        ]);

        return NextResponse.json({
            states,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, code, country } = body;

        // Validation
        if (!name || !code || !country) {
            return NextResponse.json(
                { message: "Name, Code, and Country are required" },
                { status: 400 }
            );
        }

        // Check uniqueness (compound index handles this technically, but good to check)
        const existingState = await State.findOne({ country, code });
        if (existingState) {
            return NextResponse.json(
                { message: "State code already exists for this country" },
                { status: 400 }
            );
        }

        const state = await State.create({
            name,
            code,
            country,
        });

        return NextResponse.json(
            { message: "State created successfully", state },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
