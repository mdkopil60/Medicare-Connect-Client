'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import {
    FaUsers, FaCalendarDay, FaStar, FaChartLine,
    FaExclamationTriangle, FaRedo, FaStethoscope,
    FaCheckCircle, FaRegCalendarCheck
} from 'react-icons/fa';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DoctorOverview() {
    const { data: session, isPending } = authClient.useSession();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        const email = session?.user?.email;
        console.log('Session:', session);
        console.log('Email:', email);

        if (!email) {
            setError('Email পাওয়া যাচ্ছে না। আবার login করুন।');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await fetch(
                `${API_URL}/doctor/dashboard-stats?email=${encodeURIComponent(email)}`
            );
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || `Server error ${res.status}`);
            }
            const data = await res.json();
            setStats(data);
        } catch (err) {
            setError(err.message || 'Failed to load stats');
            console.error('Dashboard stats error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isPending) {
            fetchStats();
        }
    }, [isPending, session]);

    if (isPending || loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <p className="text-sm text-slate-400 animate-pulse">Loading your dashboard…</p>
        </div>
    );

    if (error || !stats) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
            <div className="p-5 bg-red-50 rounded-full">
                <FaExclamationTriangle className="text-red-400 text-3xl" />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">Dashboard load</p>
            {error && (
                <p className="text-xs text-red-400 mt-1 font-mono bg-red-50 px-3 py-1.5 rounded-lg">
                    {error}
                </p>
            )}
            <button onClick={fetchStats}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition">
                <FaRedo className="text-xs" /> 
            </button>
        </div>
    );

    const statCards = [
        {
            label: 'Total Patients', value: stats.totalPatients ?? 0, icon: FaUsers,
            bg: 'bg-blue-50', iconColor: 'text-blue-600', border: 'border-blue-100', desc: 'Unique patients seen'
        },
        {
            label: "Today's Appointments", value: stats.todaysAppointments ?? 0, icon: FaCalendarDay,
            bg: 'bg-teal-50', iconColor: 'text-teal-600', border: 'border-teal-100', desc: 'Scheduled for today'
        },
        {
            label: 'Reviews Received', value: `${stats.averageRating ?? '0.0'} (${stats.totalReviews ?? 0})`,
            icon: FaStar, bg: 'bg-amber-50', iconColor: 'text-amber-500', border: 'border-amber-100', desc: 'Avg rating · total reviews'
        },
    ];

    const summaryItems = [
        { label: 'Patients Treated', value: stats.totalPatients ?? 0, color: 'text-blue-600', icon: FaCheckCircle },
        { label: "Today's Schedule", value: stats.todaysAppointments ?? 0, color: 'text-teal-600', icon: FaRegCalendarCheck },
        { label: 'Avg. Rating', value: stats.averageRating ?? '0.0', color: 'text-amber-500', icon: FaStar },
        { label: 'Total Reviews', value: stats.totalReviews ?? 0, color: 'text-purple-600', icon: FaStethoscope },
    ];

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FaChartLine className="text-blue-600" /> Dashboard Overview
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                    Welcome back, <span className="text-blue-500 font-semibold">{session?.user?.name}</span> — live performance snapshot
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((card, i) => (
                    <div key={i} className={`p-5 rounded-2xl border ${card.border} bg-white shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-4 ${card.bg} rounded-xl`}>
                                <card.icon className={`text-2xl ${card.iconColor}`} />
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">{card.label}</span>
                                <p className="text-2xl font-black font-mono text-slate-800 mt-0.5">{card.value}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{card.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Performance Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {summaryItems.map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 text-center">
                            <item.icon className={`mx-auto mb-1 ${item.color} text-lg`} />
                            <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}