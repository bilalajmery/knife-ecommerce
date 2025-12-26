import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "../../../../models/User";
import Order from "../../../../models/Order";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        // Determine total count for pagination
        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        // Fetch users with aggregation to get order count
        // Note: If using simple find(), we can't easily get order count without separate queries or lookup.
        // We will use aggregation here. But search and pagination needs to be part of pipeline.

        const pipeline = [
            // 1. Match based on search query
            { $match: query },

            // 2. Lookup orders
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "user",
                    as: "orders"
                }
            },

            // 3. Add orderCount field
            {
                $addFields: {
                    orderCount: { $size: "$orders" },
                    totalSpent: { $sum: "$orders.total" }
                }
            },

            // 4. Project fields to return (hide sensitive data)
            {
                $project: {
                    password: 0,
                    orders: 0, // Remove the heavy orders array
                    otp: 0,
                    resetPasswordToken: 0,
                    resetPasswordExpire: 0,
                    __v: 0
                }
            },

            // 5. Sort by most recent
            { $sort: { createdAt: -1 } },

            // 6. Pagination
            { $skip: skip },
            { $limit: limit }
        ];

        const users = await User.aggregate(pipeline);

        return NextResponse.json({
            success: true,
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
