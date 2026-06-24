'use client';

import { useState, useEffect } from 'react';
import { Card, Spinner } from '@heroui/react';
import { FaCreditCard } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PaymentManagementPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // 📥 ডাটাবেজ থেকে পেমেন্ট লেজার ফেচ করা
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access-token");
                const res = await axios.get('http://localhost:5000/payments', {
                    headers: { authorization: `Bearer ${token}` }
                });
                setPayments(res.data || []);
            } catch (err) {
                console.error("Error loading payments:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Sync Failed',
                    text: 'Unable to retrieve financial ledgers.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <FaCreditCard className="text-teal-600 text-lg" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">Financial Audit & Payment Ledgers</h3>
            </div>

            <div className="overflow-x-auto w-full">
                {loading ? (
                    <div className="flex justify-center p-10"><Spinner color="teal" /></div>
                ) : (
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
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-slate-400">No payment records found.</td>
                                </tr>
                            ) : (
                                payments.map(pay => (
                                    <tr key={pay._id} className="border-b border-slate-100 dark:border-slate-800/40 last:border-0 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors text-slate-700 dark:text-slate-300">
                                        <td className="p-3 pl-4 font-mono font-bold text-teal-600 dark:text-teal-500 text-xs">{pay._id}</td>
                                        <td className="p-3 font-medium">{pay.patientName}</td>
                                        <td className="p-3 text-xs text-slate-400 dark:text-slate-500">{new Date(pay.date).toLocaleDateString()}</td>
                                        <td className="p-3 text-right pr-4 space-x-2">
                                            <span className="font-mono font-black text-slate-700 dark:text-slate-200">${pay.amount}</span>
                                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${pay.status === 'Paid'
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                                }`}>
                                                {pay.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}