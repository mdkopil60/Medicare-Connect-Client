'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartLine, FaUsers, FaUserMd, FaCalendarCheck, FaCreditCard, FaLock } from 'react-icons/fa';

export default function AdminDashboardLayout({ children }) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Overview', path: '/dashboard/admin', icon: <FaChartLine /> },
        { name: 'Manage Users', path: '/dashboard/admin/users', icon: <FaUsers /> },
        { name: 'Manage Doctors', path: '/dashboard/admin/doctors', icon: <FaUserMd /> },
        { name: 'Appointments', path: '/dashboard/admin/appointments', icon: <FaCalendarCheck /> },
        { name: 'Payments', path: '/dashboard/admin/payments', icon: <FaCreditCard /> },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/60 dark:bg-slate-950 transition-colors duration-300">

            {/* Sidebar Control */}
            <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-5 flex flex-col justify-between">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100/40 dark:border-rose-900/20">
                        <FaLock className="text-sm" />
                        <span className="text-xs font-black tracking-wider uppercase">Admin Control</span>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                                            ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
                                            : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
                                        }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center font-medium">
                    Medicare Governance © 2026
                </div>
            </aside>

            {/* Main Dynamically Rendered Content Area */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-6">
                    {children}
                </div>
            </main>

        </div>
    );
}