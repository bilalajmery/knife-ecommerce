import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Country from "@/models/Country";

export async function GET() {
    try {
        await dbConnect();

        // 1. Basic Stats
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        // 2. Revenue Over Time (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const revenueOverTime = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$total" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Order Status Distribution
        const statusDistribution = await Order.aggregate([
            { $group: { _id: "$status", value: { $sum: 1 } } }
        ]);

        // 4. Top Selling Products
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    sales: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            { $sort: { sales: -1 } },
            { $limit: 5 }
        ]);

        // 5. Payment Method Distribution
        const paymentDistribution = await Order.aggregate([
            { $group: { _id: "$paymentMethod", value: { $sum: 1 } } }
        ]);

        // 6. User Growth (Last 7 Days)
        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 7. Orders by Country
        const ordersByCountry = await Order.aggregate([
            {
                $group: {
                    _id: "$shippingAddress.country",
                    count: { $sum: 1 },
                    revenue: { $sum: "$total" }
                }
            },
            {
                $lookup: {
                    from: "countries",
                    localField: "_id",
                    foreignField: "_id",
                    as: "countryData"
                }
            },
            { $unwind: "$countryData" },
            {
                $project: {
                    _id: 0,
                    name: "$countryData.name",
                    code: "$countryData.code",
                    count: 1,
                    revenue: 1
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const totalRevenueValue = totalRevenue[0]?.total || 0;
        const aov = totalOrders > 0 ? totalRevenueValue / totalOrders : 0;

        return NextResponse.json({
            success: true,
            stats: {
                totalRevenue: totalRevenueValue,
                totalOrders,
                totalProducts,
                totalUsers,
                aov
            },
            revenueOverTime,
            statusDistribution: statusDistribution.map(s => ({ name: s._id, value: s.value })),
            topProducts: topProducts.map(p => ({ name: p._id, sales: p.sales, revenue: p.revenue })),
            paymentDistribution: paymentDistribution.map(p => ({ name: p._id?.toUpperCase(), value: p.value })),
            userGrowth,
            ordersByCountry
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
