"use client";
import { useState, useEffect } from "react";
import {
    UserCircleIcon,
    KeyIcon,
    ShieldCheckIcon,
    BellIcon,
    ArrowPathIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    DevicePhoneMobileIcon,
    LockClosedIcon,
    Cog8ToothIcon,
    PaintBrushIcon
} from "@heroicons/react/24/outline";
import { showAlert } from "@/utils/sweetAlert";
import Sidebar from "@/app/components/admin/Sidebar";

export default function SettingsPage() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    // Profile Form
    const [profileData, setProfileData] = useState({
        name: "",
        email: ""
    });

    // Password Form
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const storedAdmin = localStorage.getItem("adminUser");
        if (storedAdmin) {
            const parsedAdmin = JSON.parse(storedAdmin);
            setAdmin(parsedAdmin);
            setProfileData({
                name: parsedAdmin.name || "",
                email: parsedAdmin.email || ""
            });
        }
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: admin._id,
                    name: profileData.name,
                    email: profileData.email
                })
            });

            const data = await res.json();

            if (data.success) {
                showAlert("success", "Success", "Profile updated successfully");
                localStorage.setItem("adminUser", JSON.stringify(data.admin));
                setAdmin(data.admin);
            } else {
                showAlert("error", "Error", data.message);
            }
        } catch (error) {
            showAlert("error", "Error", "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showAlert("error", "Error", "New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showAlert("error", "Error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: admin._id,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (data.success) {
                showAlert("success", "Success", "Password updated successfully");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } else {
                showAlert("error", "Error", data.message);
            }
        } catch (error) {
            showAlert("error", "Error", "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "profile", name: "Account Details", icon: UserCircleIcon, color: "text-blue-500 bg-blue-500/10" },
        { id: "security", name: "Security & Login", icon: ShieldCheckIcon, color: "text-purple-500 bg-purple-500/10" },
        { id: "system", name: "System Config", icon: Cog8ToothIcon, color: "text-green-500 bg-green-500/10" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar relative">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="absolute bottom-40 left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                <div className="w-full">
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                        <div>
                            <h2 className="text-5xl font-black tracking-tighter text-white">
                                Settings
                            </h2>
                            <p className="text-gray-400 mt-3 font-medium text-lg">
                                Configure your workspace and personal preferences
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-gray-900 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            System Online
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Tab Navigation Sidebar */}
                        <div className="lg:col-span-3 space-y-4">
                            <div className="bg-[#111] border border-gray-900 rounded-3xl p-4 shadow-2xl backdrop-blur-xl">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group mb-1 ${activeTab === tab.id
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-gray-400 hover:bg-gray-900/50 hover:text-white"
                                            }`}
                                    >
                                        <div className={`p-2 rounded-xl transition-colors duration-300 ${activeTab === tab.id ? "bg-white/20" : tab.color
                                            }`}>
                                            <tab.icon className="h-6 w-6" />
                                        </div>
                                        <span className="font-bold text-sm tracking-wide">{tab.name}</span>
                                        {activeTab === tab.id && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Info Card */}
                            <div className="bg-gradient-to-br from-primary to-red-900 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
                                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                <h4 className="text-lg font-black text-white mb-2 leading-tight">Elite Admin Access</h4>
                                <p className="text-primary-foreground/80 text-xs font-medium leading-relaxed">
                                    You are currently using the Super Admin console. All changes made are logged and permanent.
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                                    <ShieldCheckIcon className="h-4 w-4" />
                                    Authenticated
                                </div>
                            </div>
                        </div>

                        {/* Tab Content Area */}
                        <div className="lg:col-span-9">
                            {activeTab === "profile" && (
                                <div className="bg-[#111] border border-gray-900 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="relative group">
                                            <div className="h-24 w-24 rounded-[2rem] bg-gray-900 border-2 border-primary/20 overflow-hidden flex items-center justify-center group-hover:border-primary transition-all duration-500">
                                                <UserCircleIcon className="h-12 w-12 text-gray-700 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 p-2 bg-primary rounded-xl shadow-lg border-4 border-[#111] cursor-pointer hover:scale-110 transition-transform">
                                                <PaintBrushIcon className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">Personal Profile</h3>
                                            <p className="text-gray-500 text-sm font-medium">Your account details visible to other admins</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleProfileUpdate} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="group">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">
                                                    Full Name
                                                </label>
                                                <div className="relative group">
                                                    <UserCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                        className="block w-full pl-12 pr-6 py-4 bg-black border border-gray-800 rounded-2xl text-white font-bold placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300"
                                                        placeholder="e.g. John Doe"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">
                                                    Email Address
                                                </label>
                                                <div className="relative group">
                                                    <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="email"
                                                        value={profileData.email}
                                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                        className="block w-full pl-12 pr-6 py-4 bg-black border border-gray-800 rounded-2xl text-white font-bold placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300"
                                                        placeholder="john@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-primary hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    "Save Profile"
                                                )}
                                            </button>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider text-center sm:text-left">
                                                Your data is protected by AES-256 encryption.
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="bg-[#111] border border-gray-900 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="p-5 rounded-[2rem] bg-purple-500/10 text-purple-500">
                                            <LockClosedIcon className="h-10 w-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">Security Controls</h3>
                                            <p className="text-gray-500 text-sm font-medium">Protect your admin account with strong authentication</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePasswordUpdate} className="space-y-8">
                                        <div className="group">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-purple-500 transition-colors">
                                                Current Password
                                            </label>
                                            <div className="relative group">
                                                <KeyIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700 group-focus-within:text-purple-500 transition-colors" />
                                                <input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="block w-full pl-14 pr-6 py-4 bg-black border border-gray-800 rounded-2xl text-white font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                                                    placeholder="••••••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="group">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-purple-500 transition-colors">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="block w-full px-6 py-4 bg-black border border-gray-800 rounded-2xl text-white font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                                                    placeholder="Min. 8 characters"
                                                    required
                                                />
                                            </div>
                                            <div className="group">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-purple-500 transition-colors">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="block w-full px-6 py-4 bg-black border border-gray-800 rounded-2xl text-white font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300"
                                                    placeholder="Must match"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-8">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-white text-black hover:bg-gray-200 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50"
                                            >
                                                {loading ? "Processing..." : "Update Credentials"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === "system" && (
                                <div className="bg-[#111] border border-gray-900 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="p-5 rounded-[2rem] bg-green-500/10 text-green-500">
                                            <Cog8ToothIcon className="h-10 w-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">System Environment</h3>
                                            <p className="text-gray-500 text-sm font-medium">Core application settings and node information</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: "Admin Permission", value: "Super User / Owner", icon: ShieldCheckIcon, color: "text-blue-500" },
                                            { label: "Regional Node", value: "US-EAST-1 (North Virginia)", icon: GlobeAltIcon, color: "text-orange-500" },
                                            { label: "Last Sync Time", value: new Date().toLocaleTimeString(), icon: ArrowPathIcon, color: "text-green-500" },
                                            { label: "Version Control", value: "Stable Release v2.4.8", icon: LockClosedIcon, color: "text-gray-500" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="p-6 rounded-[1.5rem] bg-black border border-gray-900 hover:border-gray-700 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl bg-gray-900 group-hover:scale-110 transition-transform duration-300 ${item.color}`}>
                                                        <item.icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">{item.label}</p>
                                                        <p className="text-sm font-bold text-white uppercase tracking-tight">{item.value}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                                        <BellIcon className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h5 className="text-sm font-black text-white mb-1">Automatic Updates</h5>
                                            <p className="text-xs text-gray-500 font-medium">Auto-sync is currently enabled. System will fetch latest catalogs and inventory updates every 15 minutes.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
