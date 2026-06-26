'use client';

import { useState, useEffect } from 'react';
import { Card, Spinner } from '@heroui/react';
import { FaUsers, FaUserMd, FaCalendarCheck, FaStar, FaChartLine } from 'react-icons/fa';
import axios from 'axios';

export default function AdminDashboardOverview() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                // Better Auth কুকি ব্যবহার করে, তাই টোকেনের প্রয়োজন নেই।
                // withCredentials: true দেওয়া বাধ্যতামূলক যেন কুকিগুলো ব্যাকএন্ডে যায়।
                const res = await axios.get('http://localhost:5000/admin/dashboard-stats', {
                    withCredentials: true
                });
                setAnalytics(res.data);
            } catch (err) {
                console.error("Failed to load analytics:", err);
                // এখানে প্রয়োজনে এরর স্টেট হ্যান্ডেল করতে পারেন
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Spinner size="lg" color="teal" />
                <p className="text-sm text-slate-400 font-medium">Syncing system analytics...</p>
            </div>
        );
    }

    if (!analytics) {
        return <div className="text-center p-10 text-slate-500">Unable to load dashboard data. Please check your connection or permissions.</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FaChartLine className="text-teal-600" /> Admin Overview
                </h1>
                <p className="text-xs text-slate-400 mt-1">Real-time system statistics and performance metrics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Patients", val: analytics.totalPatients, icon: FaUsers, color: "bg-blue-50 text-blue-600" },
                    { label: "Total Doctors", val: analytics.totalDoctors, icon: FaUserMd, color: "bg-teal-50 text-teal-600" },
                    { label: "Total Appointments", val: analytics.totalAppointments, icon: FaCalendarCheck, color: "bg-amber-50 text-amber-600" }
                ].map((stat, i) => (
                    <Card key={i} className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 rounded-2xl shadow-sm">
                        <div className={`p-4 ${stat.color} rounded-xl`}>
                            <stat.icon className="text-2xl" />
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase">{stat.label}</span>
                            <p className="text-2xl font-black font-mono text-slate-800 dark:text-white">{stat.val}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <FaStar className="text-amber-500" /> Top Performing Physicians
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analytics.doctorPerformance?.map((doc, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{doc.name}</p>
                                <p className="text-xs text-slate-400">{doc.specialty}</p>
                            </div>
                            <span className="flex items-center gap-1 font-bold text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded-lg">
                                <FaStar /> {doc.rating}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}