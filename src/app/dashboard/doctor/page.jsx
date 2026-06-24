"use client";

import React, { useState, useEffect } from "react";
import { Card, Skeleton } from "@heroui/react";
import { Users, Calendar, Star } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function DoctorOverview() {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 📥 ডাটাবেজ থেকে ওভারভিউয়ের সম্বলিত স্ট্যাটস ডাটা ফেচ করা
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access-token");
                const res = await axios.get("http://localhost:5000/doctor/dashboard-stats", {
                    headers: { authorization: `Bearer ${token}` }
                });
                setStatsData(res.data);
            } catch (err) {
                console.error("Error loading dashboard stats:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to sync dashboard metrics.',
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
    }, []);

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
            value: statsData?.averageRating ? `${statsData.averageRating} (${statsData.totalReviews})` : "0.0 (0)",
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
                            {/* আইকন বক্স */}
                            <div className={`rounded-xl p-3 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>

                            {/* ডাটা এবং টাইটেল সেকশন (লোডিংসহ) */}
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