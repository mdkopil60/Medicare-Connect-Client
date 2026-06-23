"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import {
    LayoutDashboard,
    CalendarDays,
    ClipboardCheck,
    FileText,
    UserCog,
    Menu,
    X
} from "lucide-react";

export default function DoctorDashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { label: "Overview", href: "/dashboard/doctor", icon: LayoutDashboard },
        { label: "Manage Schedule", href: "/dashboard/doctor/schedule", icon: CalendarDays },
        { label: "Appointment Requests", href: "/dashboard/doctor/appointments", icon: ClipboardCheck },
        { label: "Prescriptions", href: "/dashboard/doctor/prescriptions", icon: FileText },
        { label: "Profile Management", href: "/dashboard/doctor/profile", icon: UserCog },
    ];

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white p-5 transition-transform md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <span className="text-xl font-bold text-blue-600">Doctor Portal</span>
                    <Button isIconOnly variant="light" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </Button>
                </div>

                <nav className="mt-6 flex-1 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Dynamic Area */}
            <div className="flex flex-1 flex-col overflow-x-hidden">
                <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6 md:justify-end">
                    <Button isIconOnly variant="light" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu size={20} />
                    </Button>
                </header>
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}