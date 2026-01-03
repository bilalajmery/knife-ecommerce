import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Country from "@/models/Country";

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const country = await Country.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!country) {
            return NextResponse.json({ message: "Country not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Country updated successfully", country },
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

        const country = await Country.findByIdAndDelete(id);

        if (!country) {
            return NextResponse.json({ message: "Country not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Country deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
