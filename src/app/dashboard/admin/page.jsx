'use client';

import { useState, useEffect } from 'react';
import { Card, Spinner } from '@heroui/react';
import {
    FaUsers, FaUserMd, FaCalendarCheck,
    FaStar, FaChartLine, FaDollarSign,
    FaClock, FaCheckCircle, FaExclamationTriangle, FaRedo
} from 'react-icons/fa';
import axios from 'axios';

export default function AdminDashboardOverview() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            // ✅ সরাসরি individual endpoints থেকে data নেওয়া
            const [usersRes, doctorsRes, appointmentsRes, paymentsRes] = await Promise.all([
                axios.get('http://localhost:5000/users').catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/doctors').catch(() => ({ data: { doctors: [] } })),
                axios.get('http://localhost:5000/appointments').catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/payments').catch(() => ({ data: [] })),
            ]);

            const users = usersRes.data || [];
            const doctors = doctorsRes.data?.doctors || doctorsRes.data || [];
            const appointments = appointmentsRes.data || [];
            const payments = paymentsRes.data || [];

            const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
            const pendingDoctors = doctors.filter(d => d.verificationStatus === 'Pending').length;
            const verifiedDoctors = doctors.filter(d => d.verificationStatus === 'Verified');

            setAnalytics({
                totalPatients: users.length,
                totalDoctors: doctors.length,
                totalAppointments: appointments.length,
                totalPayments: payments.length,
                totalRevenue,
                pendingDoctors,
                doctorPerformance: verifiedDoctors.slice(0, 3).map(doc => ({
                    name: doc.doctorName,
                    specialty: doc.specialization,
                    rating: doc.rating || '4.5'
                }))
            });

        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.message;
            setError(`Error ${status ?? ''}: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnalytics(); }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-sm text-slate-400 animate-pulse">Syncing system analytics...</p>
        </div>
    );

    if (error || !analytics) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
            <div className="p-5 bg-red-50 rounded-full">
                <FaExclamationTriangle className="text-red-400 text-3xl" />
            </div>
            <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Unable to load dashboard data
                </p>
                {error && (
                    <p className="text-xs text-red-400 mt-2 font-mono bg-red-50 px-3 py-1.5 rounded-lg inline-block max-w-md">
                        {error}
                    </p>
                )}
            </div>
            <button
                onClick={fetchAnalytics}
                className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition"
            >
                <FaRedo className="text-xs" /> Try Again
            </button>
        </div>
    );

    const statCards = [
        {
            label: "Total Users",
            val: analytics.totalPatients,
            icon: FaUsers,
            bg: "bg-blue-50 dark:bg-blue-950/30",
            iconColor: "text-blue-600",
            border: "border-blue-100 dark:border-blue-900/30"
        },
        {
            label: "Total Doctors",
            val: analytics.totalDoctors,
            icon: FaUserMd,
            bg: "bg-teal-50 dark:bg-teal-950/30",
            iconColor: "text-teal-600",
            border: "border-teal-100 dark:border-teal-900/30"
        },
        {
            label: "Appointments",
            val: analytics.totalAppointments,
            icon: FaCalendarCheck,
            bg: "bg-amber-50 dark:bg-amber-950/30",
            iconColor: "text-amber-600",
            border: "border-amber-100 dark:border-amber-900/30"
        },
        {
            label: "Total Revenue",
            val: `$${analytics.totalRevenue}`,
            icon: FaDollarSign,
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
            iconColor: "text-emerald-600",
            border: "border-emerald-100 dark:border-emerald-900/30"
        },
        {
            label: "Pending Doctors",
            val: analytics.pendingDoctors,
            icon: FaClock,
            bg: "bg-orange-50 dark:bg-orange-950/30",
            iconColor: "text-orange-500",
            border: "border-orange-100 dark:border-orange-900/30"
        },
        {
            label: "Total Payments",
            val: analytics.totalPayments,
            icon: FaCheckCircle,
            bg: "bg-purple-50 dark:bg-purple-950/30",
            iconColor: "text-purple-600",
            border: "border-purple-100 dark:border-purple-900/30"
        },
    ];

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FaChartLine className="text-teal-600" /> Admin Overview
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                    Real-time system statistics and performance metrics
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((stat, i) => (
                    <Card
                        key={i}
                        className={`p-5 border ${stat.border} bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 ${stat.bg} rounded-xl`}>
                                <stat.icon className={`text-2xl ${stat.iconColor}`} />
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                                    {stat.label}
                                </span>
                                <p className="text-2xl font-black font-mono text-slate-800 dark:text-white mt-0.5">
                                    {stat.val}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Summary Bar */}
            <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
                    System Health Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        {
                            label: "Active Doctors",
                            val: analytics.totalDoctors - analytics.pendingDoctors,
                            color: "text-teal-600"
                        },
                        {
                            label: "Awaiting Approval",
                            val: analytics.pendingDoctors,
                            color: "text-orange-500"
                        },
                        {
                            label: "Total Appointments",
                            val: analytics.totalAppointments,
                            color: "text-blue-600"
                        },
                        {
                            label: "Revenue Collected",
                            val: `$${analytics.totalRevenue}`,
                            color: "text-emerald-600"
                        },
                    ].map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
                            <p className={`text-lg font-black ${item.color}`}>{item.val}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Top Doctors */}
            {analytics.doctorPerformance?.length > 0 && (
                <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4">
                        <FaStar className="text-amber-500" /> Top Performing Physicians
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {analytics.doctorPerformance.map((doc, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                                        {doc.name}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">{doc.specialty}</p>
                                </div>
                                <span className="flex items-center gap-1 font-bold text-amber-600 text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 whitespace-nowrap">
                                    <FaStar className="text-[9px]" /> {doc.rating}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}