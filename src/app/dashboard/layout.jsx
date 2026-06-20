'use client';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import React, { useState } from 'react';
import { Button } from "@heroui/react";
import { Menu } from 'lucide-react';

const Dashboardlayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row w-full overflow-x-hidden">
            <div className="md:hidden flex items-center justify-between p-4 border-b border-divider bg-background/80 backdrop-blur-md sticky top-0 z-40">
                <span className="font-bold text-primary">Patient Portal</span>
                <Button
                    isIconOnly
                    variant="flat"
                    size="sm"
                    onClick={() => setIsSidebarOpen(true)}
                    className="cursor-pointer"
                >
                    <Menu size={18} />
                </Button>
            </div>
            <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 w-full max-w-full p-4 md:p-6 overflow-x-hidden block">
                <div className="w-full mx-auto">
                    {children}
                </div>
            </main>

        </div>
    );
};

export default Dashboardlayout;