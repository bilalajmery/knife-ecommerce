"use client";

import React, { useEffect, useState } from "react";
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import {
    BanknotesIcon,
    ShoppingBagIcon,
    UsersIcon,
    InboxStackIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import Sidebar from "../../components/admin/Sidebar";

const COLORS = ["#dc2626", "#ef4444", "#f87171", "#991b1b", "#7f1d1d"];

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/analytics")
            .then(res => res.json())
            .then(json => {
                if (json.success) setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const stats = data?.stats || {};

    return (
        <div className="flex h-screen bg-[#050505] overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 overflow-y-auto custom-scrollbar">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                            Tactical <span className="text-red-600">Analytics</span>
                        </h1>
                        <p className="text-gray-500 mt-1">Strategic performance metrics and data intelligence.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-[#111] border border-white/5 p-3 rounded-xl shadow-2xl">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                        <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">Live Data Active</span>
                    </div>
                </header>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Total Revenue", value: `$${stats.totalRevenue?.toLocaleString()}`, icon: BanknotesIcon, trend: "+12.5%", color: "text-red-500" },
                        { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBagIcon, trend: "+8.2%", color: "text-red-400" },
                        { label: "Total Users", value: stats.totalUsers, icon: UsersIcon, trend: "+5.1%", color: "text-white" },
                        { label: "Avg. Order Value", value: `$${stats.aov?.toFixed(2)}`, icon: CurrencyDollarIcon, trend: "Stable", color: "text-orange-500" },
                    ].map((stat, i) => (
                        <div key={i} className="relative overflow-hidden group bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-6 rounded-2xl shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[60px] group-hover:bg-red-600/10 transition-all"></div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-3xl font-black mt-2 tracking-tighter">{stat.value}</h3>
                                    <div className="flex items-center gap-1 mt-2 text-xs">
                                        <span className="text-green-500 font-bold">{stat.trend}</span>
                                        <span className="text-gray-600 italic">vs last month</span>
                                    </div>
                                </div>
                                <div className={`p-3 bg-red-950/20 border border-red-900/30 rounded-xl ${stat.color}`}>
                                    {stat.icon && <stat.icon className="h-6 w-6" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                    {/* Revenue Overview - Line Chart */}
                    <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight uppercase">Revenue Analytics</h2>
                                <p className="text-xs text-gray-500 mt-1">Order value progression over the last 7 days.</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-red-600"></span> REVENUE
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.revenueOverTime}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis
                                        dataKey="_id"
                                        stroke="#444"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(str) => {
                                            const date = new Date(str);
                                            return date.toLocaleDateString('en-US', { weekday: 'short' });
                                        }}
                                    />
                                    <YAxis
                                        stroke="#444"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                                        itemStyle={{ color: '#dc2626' }}
                                        cursor={{ stroke: '#dc2626', strokeWidth: 1 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#dc2626"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Status Distribution - Pie Chart */}
                    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                        <h2 className="text-xl font-bold tracking-tight mb-8 uppercase text-center">Order Status Hub</h2>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data?.statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Selling Products - Bar Chart */}
                    <div className="lg:col-span-3 bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none"></div>
                        <div className="flex items-center gap-2 mb-8 uppercase tracking-widest text-xs font-black text-red-500">
                            <ArrowTrendingUpIcon className="h-4 w-4" /> Elite Acquisitions
                        </div>
                        <h2 className="text-2xl font-black mb-10 tracking-tighter uppercase italic">Dominating <span className="text-red-600">Blades</span></h2>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.topProducts}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#555"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#555"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#1a1a1a' }}
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #222' }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#dc2626"
                                        radius={[8, 8, 0, 0]}
                                        animationBegin={500}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* New Row: User Growth & Payment Distribution */}

                    {/* User Growth Line Chart */}
                    <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                        <h2 className="text-xl font-bold tracking-tight mb-8 uppercase">User Base Expansion</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.userGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis
                                        dataKey="_id"
                                        stroke="#444"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(str) => {
                                            const date = new Date(str);
                                            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                                        }}
                                    />
                                    <YAxis stroke="#444" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#dc2626"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: '#dc2626', strokeWidth: 2, stroke: '#000' }}
                                        activeDot={{ r: 8 }}
                                        animationDuration={2500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payment Method Pie Chart */}
                    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                        <h2 className="text-xl font-bold tracking-tight mb-8 uppercase text-center">Payment Strategies</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.paymentDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        paddingAngle={10}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data?.paymentDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                <footer className="pt-10 pb-4 text-center border-t border-white/5">
                    <p className="text-xs text-gray-700 font-mono tracking-widest uppercase italic">
                        KnifeMaster Data Analytics Engine v2.0 // Dark Ops Execution
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default AnalyticsPage;
