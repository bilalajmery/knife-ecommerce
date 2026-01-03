import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Country from "@/models/Country";

export async function GET(req) {
    try {
        await dbConnect();
        const countries = await Country.find({}).sort({ name: 1 });
        return NextResponse.json({ countries }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, code } = body;

        // Validation
        if (!name || !code) {
            return NextResponse.json(
                { message: "Name and Code are required" },
                { status: 400 }
            );
        }

        const existingCountry = await Country.findOne({
            $or: [{ code }, { name }],
        });

        if (existingCountry) {
            return NextResponse.json(
                { message: "Country with this name or code already exists" },
                { status: 400 }
            );
        }

        const country = await Country.create({
            name,
            code,
        });

        return NextResponse.json(
            { message: "Country created successfully", country },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
