import { NextResponse } from "next/server";
import Taxjar from "taxjar";
import dbConnect from "@/lib/db";
import State from "@/models/State";

const client = new Taxjar({
    apiKey: process.env.TAXJAR_API_KEY
});

export async function POST(req) {
    try {
        const { amount, shipping, to_country, to_state, to_city, to_zip, stateId } = await req.json();

        console.log("--- Tax Calculation Request ---");
        console.log("To:", { to_country, to_state, to_city, to_zip });
        console.log("Amount:", amount, "Shipping:", shipping);

        // 1. Validation
        if (!amount || !to_country || !to_state || !to_zip) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // 2. Check for TaxJar API Key
        if (!process.env.TAXJAR_API_KEY || process.env.TAXJAR_API_KEY === "YOUR_TAXJAR_API_KEY") {
            console.warn("TaxJar API Key not configured. Using fallback database tax.");
            return await handleFallback(stateId, amount);
        }

        try {
            // 3. Request TaxJar calculation
            const response = await client.taxForOrder({
                from_country: "US",
                from_zip: "90002",
                from_state: "CA",
                from_city: "Los Angeles",
                to_country: to_country,
                to_zip: to_zip,
                to_state: to_state,
                to_city: to_city,
                amount: amount,
                shipping: shipping || 0,
                line_items: [
                    {
                        id: '1',
                        quantity: 1,
                        unit_price: amount
                    }
                ]
            });

            console.log("TaxJar API Success Response:", {
                amount: response.tax.amount_to_collect,
                rate: response.tax.rate
            });

            return NextResponse.json({
                taxAmount: response.tax.amount_to_collect,
                taxPercentage: (response.tax.rate * 100).toFixed(2),
                source: "taxjar"
            });

        } catch (apiError) {
            console.error("TaxJar API Error:", apiError.message);
            // 4. Fallback to DB
            return await handleFallback(stateId, amount);
        }
    } catch (error) {
        console.error("Tax Calculation Route Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

async function handleFallback(stateId, amount) {
    try {
        await dbConnect();
        const state = await State.findById(stateId);
        if (!state) {
            return NextResponse.json({ taxAmount: 0, taxPercentage: 0, source: "none" });
        }

        const taxAmount = (amount * state.taxPercentage) / 100;
        console.log(`Fallback Database Tax: ${state.name} (${state.taxPercentage}%) -> $${taxAmount}`);

        return NextResponse.json({
            taxAmount: taxAmount,
            taxPercentage: state.taxPercentage,
            source: "database"
        });
    } catch (dbError) {
        console.error("Database Fallback Error:", dbError);
        return NextResponse.json({ taxAmount: 0, taxPercentage: 0, source: "none" });
    }
}
