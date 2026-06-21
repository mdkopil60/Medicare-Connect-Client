'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@heroui/react";
import {
    LayoutDashboard,
    User,
    CalendarDays,
    CreditCard,
    Star,
    LogOut,
    X
} from 'lucide-react';

const DashboardSidebar = ({ isOpen, onClose }) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard Overview', path: '/dashboard/patient', icon: <LayoutDashboard size={18} /> },
        { name: 'My Profile', path: '/dashboard/patient/profile', icon: <User size={18} /> },
        { name: 'My Appointments', path: '/dashboard/patient/appointments', icon: <CalendarDays size={18} /> },
        { name: 'Payment History', path: '/dashboard/patient/payments', icon: <CreditCard size={18} /> },
        { name: 'My Reviews', path: '/dashboard/patient/reviews', icon: <Star size={18} /> },
    ];

    const renderNavLink = (item, isMobile = false) => {
        const isActive = pathname === item.path;
        return (
            <Link
                href={item.path}
                onClick={() => isMobile && onClose && onClose()}
                className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full
                    ${isActive
                        ? 'bg-primary/10 text-primary shadow-sm font-semibold'
                        : 'text-default-600 hover:bg-default-100 hover:text-foreground'
                    }
                `}
            >
                <span className={isActive ? 'text-primary' : 'text-default-400'}>
                    {item.icon}
                </span>
                {item.name}
            </Link>
        );
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm md:hidden animate-fade-in"
                    onClick={onClose}
                >
                    <div
                        className="w-72 h-full bg-background border-r border-divider p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out transform translate-x-0"
                        onClick={(e) => e.stopPropagation()} // ড্রয়ারের বডিতে ক্লিক করলে যাতে অফ না হয়
                    >
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-divider">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                                        P
                                    </div>
                                    <span className="font-semibold text-sm text-foreground">Patient Portal</span>
                                </div>
                                <Button
                                    isIconOnly
                                    variant="flat"
                                    radius="full"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={onClose}
                                >
                                    <X size={18} />
                                </Button>
                            </div>

                            <nav className="mt-6 space-y-1.5">
                                {menuItems.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {renderNavLink(item, true)}
                                    </React.Fragment>
                                ))}
                            </nav>
                        </div>

                        <div className="pt-4 border-t border-divider">
                            <button
                                onClick={() => {
                                    console.log('Logging out...');
                                    if (onClose) onClose();
                                }}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors duration-200 cursor-pointer"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ২. ডেক্সটপ স্ট্যাটিক সাইডবার (মোবাইলে স্ক্রিনে এটা একদম hidden থাকবে) */}
            <aside className="w-64 h-screen bg-background border-r border-divider flex flex-col justify-between p-4 hidden md:flex sticky top-0 self-start">
                <div>
                    <div className="px-3 py-4 flex items-center gap-2 border-b border-divider">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                            P
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">Patient Portal</h2>
                            <p className="text-xs text-default-400">Dashboard</p>
                        </div>
                    </div>

                    <nav className="mt-6 space-y-1">
                        {menuItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {renderNavLink(item)}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>

                <div className="pt-4 border-t border-divider">
                    <button
                        onClick={() => console.log('Logging out...')}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors duration-200 cursor-pointer"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default DashboardSidebar;