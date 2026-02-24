import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { createUspsLabel } from "@/lib/usps";

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { weight, length, width, height, serviceType, senderAddress } = await req.json();

        const order = await Order.findById(id)
            .populate("shippingAddress.country", "name")
            .populate("shippingAddress.state", "name code")
            .populate("shippingAddress.city", "name");

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Prepare USPS Label Data
        const labelData = {
            imageInfo: {
                imageType: "PDF",
                labelReceiptOption: "NONE"
            },
            toAddress: {
                firstName: order.shippingAddress.firstName,
                lastName: order.shippingAddress.lastName,
                streetAddress: order.shippingAddress.address,
                city: order.shippingAddress.city?.name || order.shippingAddress.city,
                state: order.shippingAddress.state?.code || order.shippingAddress.state,
                ZIPCode: order.shippingAddress.zip
            },
            fromAddress: {
                firstName: senderAddress.firstName,
                lastName: senderAddress.lastName,
                streetAddress: senderAddress.address,
                city: senderAddress.city,
                state: senderAddress.state,
                ZIPCode: senderAddress.zip
            },
            packageDescription: {
                mailingDate: new Date().toISOString().split('T')[0],
                weight: parseFloat(weight),
                dimensions: {
                    length: parseFloat(length),
                    width: parseFloat(width),
                    height: parseFloat(height)
                },
                serviceType: serviceType || "USPS_GROUND_ADVANTAGE"
            }
        };

        const uspsResponse = await createUspsLabel(labelData);

        // Update Order with tracking info and label
        // Note: USPS API response structure for v3 labels usually contains trackingNumber and labelImage
        const trackingId = uspsResponse.trackingNumber;
        const labelBase64 = uspsResponse.labelImage; // Base64 encoded PDF

        order.shippingDetails = {
            carrier: "USPS",
            trackingId: trackingId,
            shippedAt: new Date(),
            labelUrl: `data:application/pdf;base64,${labelBase64}` // Temporary storage for demo/immediate download
        };
        order.status = "shipped";
        await order.save();

        return NextResponse.json({
            success: true,
            message: "USPS Shipment Booked successfully",
            trackingId,
            labelBase64,
            order
        });

    } catch (error) {
        console.error("USPS Booking API Error:", error);
        return NextResponse.json({
            message: error.message || "USPS Booking Failed",
            error: error.message
        }, { status: 500 });
    }
}
