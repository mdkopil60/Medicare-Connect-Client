"use client";
import React from "react";

export default function DashboardRootLayout({ children }) {
    return (
        <div className="w-full min-h-screen bg-slate-50">
            {children}
        </div>
    );
}