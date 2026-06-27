"use client";

import React, { useState, useEffect } from "react";
import { Card, Chip, Button, Input, Spinner } from "@heroui/react";
import { Calendar, CreditCard, CheckCircle2, DollarSign, Search, Receipt } from "lucide-react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";


export default function PaymentHistoryPage() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        if (isPending || !user?.email) return;
        const fetchPaymentHistory = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access-token");

                const res = await axios.get(
                    `http://localhost:5000/patient/payments/${user.email}`,
                  
                );

                setPayments(res.data || []);
            } catch (err) {
                console.error("Error fetching payment history:", err);
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentHistory();
    }, [user?.email, isPending]);

    const filteredPayments = payments.filter((item) => {
        const doctorName = item.doctorName || "";
        const txnId = item.transactionId || "";
        return (
            doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txnId.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Session লোড বা payment fetch চলাকালীন spinner দেখাও
    if (isPending || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Spinner size="lg" color="success" />
                <p className="mt-4 text-default-500 font-medium animate-pulse">
                    Loading Your Payment Logs...
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl p-6 min-h-screen bg-slate-50/40 dark:bg-zinc-950">

            {/* Header */}
            <div className="mb-10 border-b border-default-200/60 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                        Payment History
                    </h1>
                    <p className="text-default-500 text-sm mt-1">
                        View your paid appointments, digital transaction logs, and receipts.
                    </p>
                </div>

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
                        <p className="text-lg font-semibold text-default-600">
                            No payment records found for your account.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPayments.map((item) => {
                        const doctorName = item.doctorName || "Expert Doctor";
                        const specialty = item.specialty || "Specialist";
                        const txnId = item.transactionId || "N/A";
                        const amount = item.amount
                            ? `$${parseFloat(item.amount).toFixed(2)}`
                            : "$0.00";
                        const paidDate = item.date
                            ? new Date(item.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                            : "N/A";

                        return (
                            <Card
                                key={item._id}
                                className="group relative border border-emerald-100/60 dark:border-emerald-950/50 hover:border-emerald-400/50 bg-gradient-to-b from-emerald-50/10 via-background to-background transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start gap-3 mb-5">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105 duration-300">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold tracking-tight text-default-800 leading-snug">
                                                    {doctorName}
                                                </h3>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mt-0.5">
                                                    {specialty}
                                                </p>
                                            </div>
                                        </div>

                                        <Chip
                                            variant="flat"
                                            color="success"
                                            size="sm"
                                            startContent={<CheckCircle2 className="w-3.5 h-3.5 mx-1" />}
                                            className="font-bold px-2 rounded-full border-none"
                                        >
                                            Paid
                                        </Chip>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/30 flex flex-col gap-3 mb-4">
                                        <div className="flex items-center justify-between text-sm font-medium text-default-700">
                                            <div className="flex items-center gap-2.5">
                                                <Calendar className="w-4 h-4 text-emerald-500" />
                                                <span className="text-default-500">Paid Date</span>
                                            </div>
                                            <span>{paidDate}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm font-medium text-default-700 border-t border-emerald-100/30 pt-2">
                                            <div className="flex items-center gap-2.5">
                                                <CreditCard className="w-4 h-4 text-emerald-500" />
                                                <span className="text-default-500">Method</span>
                                            </div>
                                            <span className="bg-default-100 px-2 py-0.5 rounded-md text-xs font-bold text-default-700">
                                                Stripe Card
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm font-medium text-default-700 border-t border-emerald-100/30 pt-2">
                                            <div className="flex items-center gap-2.5">
                                                <Receipt className="w-4 h-4 text-emerald-500" />
                                                <span className="text-default-500">Txn ID</span>
                                            </div>
                                            <span
                                                className="font-mono text-xs text-default-600 font-bold bg-background px-2 py-0.5 rounded border border-default-200 max-w-[120px] truncate"
                                                title={txnId}
                                            >
                                                {txnId}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 pt-2 flex items-center justify-between bg-gradient-to-t from-emerald-50/20 to-transparent">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-default-400">
                                            Total Charged
                                        </span>
                                        <span className="text-2xl font-black text-default-800 tracking-tight">
                                            {amount}
                                        </span>
                                    </div>

                                    <Button
                                        className="font-bold text-xs h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm px-4"
                                        variant="flat"
                                        onPress={() => alert(`Invoice for Transaction: ${txnId}`)}
                                    >
                                        Invoice
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}