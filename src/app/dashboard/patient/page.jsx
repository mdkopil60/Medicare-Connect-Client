'use client';

import React from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, Avatar, Chip, Button } from "@heroui/react";
import {
    CalendarClock,
    History,
    CreditCard,
    Heart,
    Star,
    ArrowUpRight
} from 'lucide-react';

const PatientDashboardHomepage = () => {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-default-500 font-medium">Loading Dashboard.....</div>
            </div>
        );
    }

    const user = session?.user;

    const stats = [
        {
            title: "Upcoming Appointments",
            value: "2 Active",
            desc: "Next: Tomorrow at 10:00 AM",
            icon: <CalendarClock size={24} className="text-blue-500" />,
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Appointment History",
            value: "14 Total",
            desc: "Last visit: 12 June, 2026",
            icon: <History size={24} className="text-success" />,
            bgColor: "bg-success/10",
        },
        {
            title: "Total Payments",
            value: "$420.00",
            desc: "All transactions cleared",
            icon: <CreditCard size={24} className="text-warning" />,
            bgColor: "bg-warning/10",
        },
    ];

    const favoriteDoctors = [
        { name: "Dr. Ariful Islam", specialty: "Cardiologist", rating: "4.9", image: "" },
        { name: "Dr. Nusrat Jahan", specialty: "Dermatologist", rating: "4.8", image: "" },
        { name: "Dr. Sajid Rahman", specialty: "Pediatrician", rating: "5.0", image: "" },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {stats.map((stat, index) => (
                    <Card key={index} shadow="sm" isPressable className="border border-divider bg-background/60 backdrop-blur-md w-full">
                        <div className="flex flex-row items-center gap-4 p-5 w-full">
                            <div className={`p-3 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
                                {stat.icon}
                            </div>
                            <div className="flex flex-col items-start text-left min-w-0 flex-1">
                                <p className="text-xs font-medium text-default-400 uppercase tracking-wider truncate w-full">{stat.title}</p>
                                <h4 className="text-xl font-bold text-foreground mt-0.5">{stat.value}</h4>
                                <p className="text-xs text-default-500 mt-1 truncate w-full">{stat.desc}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Heart size={20} className="text-danger fill-danger/10" />
                        Favorite Doctors
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {favoriteDoctors.map((doc, index) => (
                        <Card key={index} shadow="sm" className="border border-divider w-full">
                            <div className="p-5 flex items-center gap-4 w-full">
                                <Avatar src={doc.image} name={doc.name} className="w-12 h-12 text-medium shrink-0" color="primary" isBordered />
                                <div className="min-w-0 flex-1 text-left">
                                    <h4 className="font-semibold text-sm text-foreground truncate">{doc.name}</h4>
                                    <p className="text-xs text-default-400 truncate">{doc.specialty}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star size={12} className="text-warning fill-warning" />
                                        <span className="text-xs font-medium text-default-600">{doc.rating}</span>
                                    </div>
                                </div>
                                <Button isIconOnly variant="light" radius="full" size="sm" className="cursor-pointer">
                                    <ArrowUpRight size={16} />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboardHomepage;