"use client";

import React, { useState, useEffect } from "react";
import { Card, Skeleton } from "@heroui/react";
import { Users, Calendar, Star } from "lucide-react";
import { useSession } from "@/lib/auth-client"; // ✅ session থেকে email নিন
import axios from "axios";
import Swal from "sweetalert2";

export default function DoctorOverview() {
    const { data: session, isPending } = useSession();
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ token নেওয়ার helper — AppointmentRequestsPage এর মতো
    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        if (isPending) return;
        if (!session?.user?.email) return;

        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `http://localhost:5000/doctor/dashboard-stats`,
                    getAuthHeaders() // ✅ সঠিক header
                );
                setStatsData(res.data);
            } catch (err) {
                console.error("Dashboard stats error:", err.response?.status, err.response?.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to load stats',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, [session, isPending]); // ✅ session ready হলে fetch করো

    const statsConfig = [
        {
            title: "Total Patients",
            value: statsData?.totalPatients ?? "0",
            icon: Users,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Today's Appointments",
            value: statsData?.todaysAppointments ?? "0",
            icon: Calendar,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Reviews Received",
            value: statsData?.averageRating
                ? `${statsData.averageRating} (${statsData.totalReviews})`
                : "0.0 (0)",
            icon: Star,
            color: "bg-amber-100 text-amber-600"
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight mb-6 text-slate-800 dark:text-white">
                Dashboard Overview
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statsConfig.map((stat, idx) => (
                    <Card key={idx} className="border border-slate-100 dark:border-slate-800/80 shadow-sm p-6 bg-white dark:bg-slate-900">
                        <div className="flex flex-row items-center gap-4">
                            <div className={`rounded-xl p-3 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {stat.title}
                                </p>
                                {loading ? (
                                    <Skeleton className="h-7 w-24 rounded-lg mt-1" />
                                ) : (
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                                        {stat.value}
                                    </h3>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}