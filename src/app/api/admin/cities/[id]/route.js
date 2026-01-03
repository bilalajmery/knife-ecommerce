import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import City from "@/models/City";

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const city = await City.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        })
            .populate("country", "name")
            .populate("state", "name");

        if (!city) {
            return NextResponse.json({ message: "City not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "City updated successfully", city },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const city = await City.findByIdAndDelete(id);

        if (!city) {
            return NextResponse.json({ message: "City not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "City deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
