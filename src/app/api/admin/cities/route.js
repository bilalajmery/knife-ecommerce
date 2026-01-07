import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import City from "@/models/City";
import Country from "@/models/Country"; // Ensure Country is registered
import State from "@/models/State"; // Ensure State is registered

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const stateId = searchParams.get("state");
        const countryId = searchParams.get("country");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 1000; // Increased default limit for cities
        const skip = (page - 1) * limit;
        const search = searchParams.get("search") || "";

        let query = {};
        if (stateId) {
            query.state = stateId;
        }
        if (countryId) {
            query.country = countryId;
        }
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const [cities, total] = await Promise.all([
            City.find(query)
                .populate("country", "name")
                .populate("state", "name")
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit),
            City.countDocuments(query)
        ]);

        return NextResponse.json({
            cities,
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
        const { name, country, state } = body;

        // Validation
        if (!name || !country || !state) {
            return NextResponse.json(
                { message: "Name, Country, and State are required" },
                { status: 400 }
            );
        }

        const city = await City.create({
            name,
            country,
            state,
        });

        return NextResponse.json(
            { message: "City created successfully", city },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
