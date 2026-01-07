import { NextResponse } from "next/server";
import Taxjar from "taxjar";

// Determine environment: check explicit env var first, then auto-detect from key prefix
const explicitEnv = process.env.TAXJAR_API_ENVIRONMENT?.toLowerCase();
const isSandbox = explicitEnv === "sandbox" ||
    (explicitEnv !== "production" && process.env.TAXJAR_API_KEY?.startsWith("sbx_"));

const client = new Taxjar({
    apiKey: process.env.TAXJAR_API_KEY,
    apiUrl: isSandbox ? Taxjar.SANDBOX_API_URL : Taxjar.DEFAULT_API_URL
});

console.log(`[TaxJar] Environment: ${isSandbox ? "SANDBOX" : "PRODUCTION"}`);
console.log(`[TaxJar] API URL: ${isSandbox ? Taxjar.SANDBOX_API_URL : Taxjar.DEFAULT_API_URL}`);
console.log(`[TaxJar] API Key configured: ${process.env.TAXJAR_API_KEY ? "Yes" : "No"}`);

export async function POST(req) {
    try {
        const { amount, shipping, to_country, to_state, to_city, to_zip } = await req.json();

        console.log("--- Tax Calculation Request ---");
        console.log("To:", { to_country, to_state, to_city, to_zip });
        console.log("Amount:", amount, "Shipping:", shipping);

        // 1. Validation
        if (!amount || !to_country || !to_state || !to_zip) {
            return NextResponse.json({ message: "Missing required fields for tax calculation" }, { status: 400 });
        }

        // 2. Check for TaxJar API Key
        if (!process.env.TAXJAR_API_KEY || process.env.TAXJAR_API_KEY === "YOUR_TAXJAR_API_KEY" || process.env.TAXJAR_API_KEY === "") {
            console.error("TaxJar API Key not configured.");
            return NextResponse.json({
                message: "Tax service is not configured. Please contact support.",
                error: "TAXJAR_NOT_CONFIGURED"
            }, { status: 500 });
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
                total_tax: response.tax.amount_to_collect,
                rate: response.tax.rate
            });

            return NextResponse.json({
                taxAmount: response.tax.amount_to_collect,
                taxPercentage: (response.tax.rate * 100).toFixed(2),
                source: "taxjar"
            });

        } catch (apiError) {
            console.error("TaxJar API Error:", apiError.message);

            let userMessage = `Tax calculation failed: ${apiError.message}`;

            // Provide specific guidance for common errors
            if (apiError.message.includes("Unauthorized")) {
                userMessage = "Tax service authentication failed. Common causes:\n" +
                    "1. Invalid or expired API token\n" +
                    "2. Using a sandbox token in production (or vice versa)\n" +
                    "3. Account permissions - only Administrators can use API tokens\n" +
                    "4. API token not enabled for tax calculations\n\n" +
                    "Please verify your TAXJAR_API_KEY in your environment variables.";
            }

            return NextResponse.json({
                message: userMessage,
                error: apiError.message
            }, { status: 500 });
        }
    } catch (error) {
        console.error("Tax Calculation Route Error:", error);
        return NextResponse.json({ message: "Internal Server Error during tax calculation" }, { status: 500 });
    }
}
