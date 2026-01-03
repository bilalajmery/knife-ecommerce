import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import State from "@/models/State";

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const state = await State.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).populate("country", "name");

        if (!state) {
            return NextResponse.json({ message: "State not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "State updated successfully", state },
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

        const state = await State.findByIdAndDelete(id);

        if (!state) {
            return NextResponse.json({ message: "State not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "State deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
