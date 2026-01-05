import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import State from "@/models/State";
import Country from "@/models/Country"; // Ensure Country is registered

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const countryId = searchParams.get("country");

        let query = {};
        if (countryId) {
            query.country = countryId;
        }

        const states = await State.find(query)
            .populate("country", "name")
            .sort({ name: 1 });

        return NextResponse.json({ states }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, code, country, taxPercentage } = body;

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
            taxPercentage: taxPercentage || 0,
        });

        return NextResponse.json(
            { message: "State created successfully", state },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
