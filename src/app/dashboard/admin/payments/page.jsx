'use client';

import { useState } from 'react';
import { Card } from '@heroui/react';
import { FaCreditCard } from 'react-icons/fa';

const INITIAL_PAYMENTS = [
    { _id: "tx-7001", patientName: "Alice Green", amount: 1500, date: "2026-06-23", status: "Paid" },
    { _id: "tx-7002", patientName: "John Doe", amount: 1200, date: "2026-06-23", status: "Paid" }
];

export default function PaymentManagementPage() {
    const [payments] = useState(INITIAL_PAYMENTS);

    return (
        <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <FaCreditCard className="text-teal-600 text-lg" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">Financial Audit & Payment Ledgers</h3>
            </div>
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold text-xs uppercase">
                            <th className="p-3 pl-4">Transaction Reference</th>
                            <th className="p-3">Patient Account</th>
                            <th className="p-3">Settle Date</th>
                            <th className="p-3 text-right pr-4">Amount / Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(pay => (
                            <tr key={pay._id} className="border-b border-slate-100 dark:border-slate-800/40 last:border-0 text-slate-700 dark:text-slate-300">
                                <td className="p-3 pl-4 font-mono font-bold text-teal-600 text-xs">{pay._id}</td>
                                <td className="p-3 font-medium">{pay.patientName}</td>
                                <td className="p-3 text-xs text-slate-400">{pay.date}</td>
                                <td className="p-3 text-right pr-4 space-x-2">
                                    <span className="font-mono font-black text-slate-700 dark:text-slate-200">${pay.amount}</span>
                                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">{pay.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}