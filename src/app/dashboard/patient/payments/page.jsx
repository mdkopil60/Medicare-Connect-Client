"use client";

import React, { useState } from "react";
import { Card, Chip, Button, Input } from "@heroui/react";
import { Calendar, CreditCard, CheckCircle2, DollarSign, Search, Receipt } from "lucide-react";

// Dummy Payment & Transaction Records
const initialPayments = [
    {
        id: "TXN-98431",
        doctor: "Dr. Nafis Iqbal",
        specialty: "Cardiologist",
        date: "2026-06-15",
        amount: "৳১,৫০০",
        method: "bKash",
        status: "Success",
    },
    {
        id: "TXN-76123",
        doctor: "Dr. Sarah Rahman",
        specialty: "Dermatologist",
        date: "2026-06-10",
        amount: "৳১,২০০",
        method: "Visa Card",
        status: "Success",
    },
    {
        id: "TXN-43210",
        doctor: "Dr. Amit Hasan",
        specialty: "Pediatrician",
        date: "2026-05-28",
        amount: "৳১,০০০",
        method: "Nagad",
        status: "Success",
    },
];

export default function PaymentHistoryPage() {
    const [payments] = useState(initialPayments);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter based on search input (Doctor name or Transaction ID)
    const filteredPayments = payments.filter(
        (item) =>
            item.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto max-w-6xl p-6 min-h-screen bg-slate-50/40 dark:bg-zinc-950">
            {/* Colorful Header */}
            <div className="mb-10 border-b border-default-200/60 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                        Payment History
                    </h1>
                    <p className="text-default-500 text-sm mt-1">
                        View your paid appointments, digital transaction logs, and receipts.
                    </p>
                </div>

                {/* Search Bar Component */}
                <div className="w-full md:w-72">
                    <Input
                        isClearable
                        radius="xl"
                        placeholder="Search Txn ID or Doctor..."
                        startContent={<Search className="w-4 h-4 text-default-400" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery("")}
                        variant="bordered"
                        className="font-medium"
                    />
                </div>
            </div>

            {filteredPayments.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-default-200 bg-default-50/10">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Receipt className="w-12 h-12 text-default-400" />
                        <p className="text-lg font-semibold text-default-600">No payment records found.</p>
                    </div>
                </Card>
            ) : (
                // PAYMENTS GRID LAYOUT
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPayments.map((item) => (
                        <Card
                            key={item.id}
                            className="group relative border border-emerald-100/60 dark:border-emerald-950/50 hover:border-emerald-400/50 bg-gradient-to-b from-emerald-50/10 via-background to-background transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl"
                        >
                            {/* Main Content Card */}
                            <div className="p-6">
                                {/* Card Top Row */}
                                <div className="flex justify-between items-start gap-3 mb-5">
                                    <div className="flex items-center gap-3.5">
                                        {/* Emerald Amount Icon Badge */}
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105 duration-300">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold tracking-tight text-default-800 leading-snug">
                                                {item.doctor}
                                            </h3>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mt-0.5">
                                                {item.specialty}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Success Badge */}
                                    <Chip
                                        variant="flat"
                                        color="success"
                                        size="sm"
                                        startContent={<CheckCircle2 className="w-3.5 h-3.5 mx-1" />}
                                        className="font-bold px-2 rounded-full border-none"
                                    >
                                        {item.status}
                                    </Chip>
                                </div>

                                {/* Central Info Grid Structure */}
                                <div className="p-4 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/30 flex flex-col gap-3 mb-4">
                                    <div className="flex items-center justify-between text-sm font-medium text-default-700">
                                        <div className="flex items-center gap-2.5">
                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                            <span className="text-default-500">Paid Date</span>
                                        </div>
                                        <span>{item.date}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm font-medium text-default-700 border-t border-emerald-100/30 pt-2">
                                        <div className="flex items-center gap-2.5">
                                            <CreditCard className="w-4 h-4 text-emerald-500" />
                                            <span className="text-default-500">Method</span>
                                        </div>
                                        <span className="bg-default-100 px-2 py-0.5 rounded-md text-xs font-bold text-default-700">
                                            {item.method}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm font-medium text-default-700 border-t border-emerald-100/30 pt-2">
                                        <div className="flex items-center gap-2.5">
                                            <Receipt className="w-4 h-4 text-emerald-500" />
                                            <span className="text-default-500">Txn ID</span>
                                        </div>
                                        <span className="font-mono text-xs text-default-600 font-bold bg-background px-2 py-0.5 rounded border border-default-200">
                                            {item.id}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Total Amount Display Area */}
                            <div className="px-6 pb-6 pt-2 flex items-center justify-between bg-gradient-to-t from-emerald-50/20 to-transparent">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-default-400">Total Charged</span>
                                    <span className="text-2xl font-black text-default-800 tracking-tight">{item.amount}</span>
                                </div>

                                {/* Print/View Invoice Button */}
                                <Button
                                    className="font-bold text-xs h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm px-4"
                                    variant="flat"
                                    onPress={() => alert(`Downloading Invoice for ${item.id}`)}
                                >
                                    Invoice
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}