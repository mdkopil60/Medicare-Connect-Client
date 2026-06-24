'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Card, Avatar, Button, Spinner } from "@heroui/react";
import {
    CalendarClock,
    History,
    CreditCard,
    Heart,
    Star,
    ArrowUpRight
} from 'lucide-react';
import axios from 'axios';

const PatientDashboardHomepage = () => {
    const { data: session, isPending: isSessionPending } = useSession();
    const router = useRouter();

    // ডাইনামিক ডেটা স্টেট
    const [statsData, setStatsData] = useState(null);
    const [favoriteDoctors, setFavoriteDoctors] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // টোকেন গেটার মেথড
    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsDataLoading(true);

                // ১ & ২. ব্যাকএন্ড থেকে প্যারালালি স্ট্যাটস ও ফেভারিট ডক্টরদের ডেটা ফেচ করা
                const [statsRes, doctorsRes] = await Promise.all([
                    axios.get("http://localhost:5000/patient/dashboard-stats", getAuthHeaders()),
                    axios.get("http://localhost:5000/patient/favorite-doctors", getAuthHeaders())
                ]);

                setStatsData(statsRes.data);
                setFavoriteDoctors(doctorsRes.data || []);
            } catch (err) {
                console.error("Error loading dashboard metrics:", err);
            } finally {
                setIsDataLoading(false);
            }
        };

        if (session?.user) {
            fetchDashboardData();
        }
    }, [session]);

    // সেশন বা এপিআই ডেটা লোড হওয়া পর্যন্ত স্পিনার দেখানো
    if (isSessionPending || isDataLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
                <Spinner size="lg" color="primary" />
                <div className="text-default-500 text-sm font-medium animate-pulse">Loading secure dashboard metrics...</div>
            </div>
        );
    }

    const user = session?.user;

    // ব্যাকএন্ড থেকে প্রাপ্ত রিয়াল ডেটা ম্যাপ করা (ফেলব্যাক ভ্যালু সহ)
    const stats = [
        {
            title: "Upcoming Appointments",
            value: `${statsData?.upcomingCount || 0} Active`,
            desc: statsData?.nextAppointmentText || "No active schedule",
            icon: <CalendarClock size={24} className="text-blue-500" />,
            bgColor: "bg-blue-500/10",
            route: "/dashboard/appointments"
        },
        {
            title: "Appointment History",
            value: `${statsData?.totalHistoryCount || 0} Total`,
            desc: statsData?.lastVisitText || "No previous records",
            icon: <History size={24} className="text-success" />,
            bgColor: "bg-success/10",
            route: "/dashboard/appointments/history"
        },
        {
            title: "Total Payments",
            value: `$${(statsData?.totalPayments || 0).toFixed(2)}`,
            desc: "All transactions cleared",
            icon: <CreditCard size={24} className="text-warning" />,
            bgColor: "bg-warning/10",
            route: "/dashboard/payments"
        },
    ];

    return (
        <div className="space-y-8 p-1 w-full">
            {/* Top Welcome Section */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    Welcome Back, {user?.name || 'Patient'} 👋
                </h2>
                <p className="text-sm text-default-400">
                    Here is a quick overview of your health dashboard activities.
                </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        shadow="sm"
                        isPressable
                        onClick={() => router.push(stat.route)}
                        className="border border-divider bg-background/60 backdrop-blur-md w-full transition-transform hover:scale-[1.01]"
                    >
                        <div className="flex flex-row items-center gap-4 p-5 w-full">
                            <div className={`p-3 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
                                {stat.icon}
                            </div>
                            <div className="flex flex-col items-start text-left min-w-0 flex-1">
                                <p className="text-xs font-semibold text-default-400 uppercase tracking-wider truncate w-full">{stat.title}</p>
                                <h4 className="text-xl font-bold text-foreground mt-0.5">{stat.value}</h4>
                                <p className="text-xs text-default-500 mt-1 truncate w-full">{stat.desc}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Favorite Doctors Section */}
            <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Heart size={20} className="text-danger fill-danger/10" />
                        Favorite Doctors
                    </h3>
                </div>

                {favoriteDoctors.length === 0 ? (
                    <Card className="p-8 text-center border-dashed border-2 border-default-200 bg-default-50/50">
                        <p className="text-sm text-default-400">You haven't added any doctors to your favorites yet.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        {favoriteDoctors.map((doc) => {
                            const doctorId = doc._id || doc.id;
                            return (
                                <Card key={doctorId} shadow="sm" className="border border-divider w-full">
                                    <div className="p-5 flex items-center gap-4 w-full">
                                        <Avatar
                                            src={doc.image || `https://ui-avatars.com/api/?name=${doc.name}&background=6366f1&color=fff`}
                                            name={doc.name}
                                            className="w-12 h-12 text-medium shrink-0"
                                            color="primary"
                                            isBordered
                                        />
                                        <div className="min-w-0 flex-1 text-left">
                                            <h4 className="font-semibold text-sm text-foreground truncate">{doc.name}</h4>
                                            <p className="text-xs text-default-400 truncate">{doc.specialty}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star size={12} className="text-warning fill-warning" />
                                                <span className="text-xs font-medium text-default-600">{doc.rating || "4.5"}</span>
                                            </div>
                                        </div>
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            radius="full"
                                            size="sm"
                                            className="cursor-pointer"
                                            onClick={() => router.push(`/doctors/${doctorId}`)}
                                        >
                                            <ArrowUpRight size={16} />
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboardHomepage;