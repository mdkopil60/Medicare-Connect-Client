"use client";
import React from "react";
import { Card } from "@heroui/react"; // Removed CardBody
import { Users, Calendar, Star } from "lucide-react";

export default function DoctorOverview() {
    const stats = [
        { title: "Total Patients", value: "1,248", icon: Users, color: "bg-blue-100 text-blue-600" },
        { title: "Today's Appointments", value: "14", icon: Calendar, color: "bg-green-100 text-green-600" },
        { title: "Reviews Received", value: "4.9 (320)", icon: Star, color: "bg-amber-100 text-amber-600" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight mb-6">Dashboard Overview</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border border-slate-100 shadow-sm p-6">
                        {/* Replaced CardBody with a clean Tailwind div wrapper */}
                        <div className="flex flex-row items-center gap-4">
                            <div className={`rounded-xl p-3 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}