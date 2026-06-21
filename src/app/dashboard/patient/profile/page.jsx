"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                {/* Profile Detail Card */}
                <div className="relative px-6 pb-8">
                    {/* Avatar/Profile Image */}
                    <div className="absolute -top-16 left-6">
                        <img
                            src={user.image || "https://i.pravatar.cc/150"}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-md"
                        />
                    </div>
                    {/* User Summary */}
                    <div className="pt-20">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verified Member</p>
                    </div>
                    <hr className="my-6 border-gray-200 dark:border-gray-800" />
                    {/* Account Details Information */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Account Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Full Name</span>
                                <span className="text-base font-medium">{user.name}</span>
                            </div>
                            {/* Email Address */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Email Address</span>
                                <span className="text-base font-medium break-all">{user.email}</span>
                            </div>
                            {/* Account ID */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">User ID</span>
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-300 block truncate" title={user.id}>
                                    {user.id}
                                </span>
                            </div>
                            {/* Joined Date */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Joined Since</span>
                                <span className="text-base font-medium">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Quick Actions Footer */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-end">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={async () => {
                                await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => router.push("/login")
                                    }
                                });
                            }}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition"
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}