"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Shield, Calendar, LayoutDashboard, LogOut, Activity } from "lucide-react";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    if (!mounted || isPending) {
        return (
            <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) return null;
    const user = session.user;

    return (
        <div className="min-h-[80vh] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white py-10 px-4 transition-colors duration-300">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">

                {/* Visual Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                        {user.role || "Patient"} Account
                    </span>
                </div>

                {/* Profile Detail Card */}
                <div className="relative px-6 pb-8">
                    {/* Avatar/Profile Image */}
                    <div className="absolute -top-16 left-6">
                        <img
                            src={user.image || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=3b82f6&color=fff`}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-md bg-gray-100"
                        />
                    </div>

                    {/* User Summary */}
                    <div className="pt-20">
                        <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span>Verified {user.role || "User"} Member</span>
                        </p>
                    </div>

                    <hr className="my-6 border-gray-200 dark:border-gray-800" />

                    {/* Account Details Information */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <User className="w-5 h-5" /> Account Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">Full Name</span>
                                    <span className="text-base font-medium">{user.name}</span>
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 flex items-start gap-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">Email Address</span>
                                    <span className="text-base font-medium break-all">{user.email}</span>
                                </div>
                            </div>

                            {/* Account ID */}
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 flex items-start gap-3">
                                <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">User ID</span>
                                    <span className="text-sm font-mono text-gray-600 dark:text-gray-300 block truncate" title={user.id}>
                                        {user.id}
                                    </span>
                                </div>
                            </div>

                            {/* Joined Date */}
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">Joined Since</span>
                                    <span className="text-base font-medium">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                                    </span>
                                </div>
                            </div>

                            {user.phoneNumber && (
                                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 flex items-start gap-3 md:col-span-2">
                                    <Activity className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">Contact Number</span>
                                        <span className="text-base font-medium">{user.phoneNumber}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions Footer */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-end border-t border-gray-100 dark:border-gray-800/60 pt-6">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm rounded-xl transition flex items-center gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                        </button>
                        <button
                            onClick={async () => {
                                await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => router.push("/login")
                                    }
                                });
                            }}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 shadow-md shadow-red-600/10"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}