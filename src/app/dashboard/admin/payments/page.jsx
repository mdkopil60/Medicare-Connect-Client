'use client';

import { useState, useEffect } from 'react';
import { Card, Spinner } from '@heroui/react';
import { FaCreditCard, FaCheckCircle, FaClock } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PaymentManagementPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/payments`, getAuthHeaders());
                setPayments(res.data || []);
            } catch (err) {
                console.error("Error loading payments:", err);
                Swal.fire({ icon: 'error', title: 'Failed to load payments' });
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    // Stats
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const paidCount = payments.filter(p => p.paymentStatus === 'paid').length;
    const pendingCount = payments.filter(p => p.paymentStatus !== 'paid').length;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FaCreditCard className="text-teal-600" /> Financial Audit & Payment Ledgers
                </h2>
                <p className="text-xs text-slate-400 mt-1">All transaction records from patient appointments</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-2xl font-black text-teal-600">${totalRevenue}</p>
                    <p className="text-xs text-slate-400 mt-1">Total Revenue</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-2xl font-black text-emerald-500">{paidCount}</p>
                    <p className="text-xs text-slate-400 mt-1">Paid</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-2xl font-black text-amber-500">{pendingCount}</p>
                    <p className="text-xs text-slate-400 mt-1">Pending</p>
                </div>
            </div>

            {/* Table */}
            <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="overflow-x-auto w-full">
                    {loading ? (
                        <div className="flex justify-center p-10">
                            <Spinner size="lg" color="primary" />
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100/70 dark:bg-slate-800 text-slate-500 font-bold text-xs tracking-wider uppercase">
                                    <th className="p-4 pl-6">#</th>
                                    <th className="p-4">Transaction ID</th>
                                    <th className="p-4">Patient ID</th>
                                    <th className="p-4">Appointment ID</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-center pr-6">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-10 text-slate-400">
                                            No payment records found.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((pay, idx) => (
                                        <tr key={pay._id}
                                            className="border-b border-slate-100 dark:border-slate-800/40 last:border-0 hover:bg-slate-50/40 transition-colors">
                                            <td className="p-4 pl-6 text-slate-400 text-xs">{idx + 1}</td>

                                            {/* Transaction ID */}
                                            <td className="p-4 font-mono text-xs text-teal-600 dark:text-teal-400 max-w-[160px] truncate">
                                                {pay.transactionId || '—'}
                                            </td>

                                            {/* Patient ID */}
                                            <td className="p-4 font-medium text-slate-600 dark:text-slate-300">
                                                {pay.patientId || '—'}
                                            </td>

                                            {/* Appointment ID */}
                                            <td className="p-4 font-mono text-xs text-slate-400">
                                                {pay.appointmentId?.toString().slice(-8) || '—'}
                                            </td>

                                            {/* Amount */}
                                            <td className="p-4 text-right font-mono font-black text-slate-700 dark:text-slate-200">
                                                ${pay.amount}
                                            </td>

                                            {/* Status */}
                                            <td className="p-4 text-center pr-6">
                                                {pay.paymentStatus === 'paid' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                                                        <FaCheckCircle className="text-[10px]" /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                                                        <FaClock className="text-[10px]" /> {pay.paymentStatus || 'Pending'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                            {/* Footer total */}
                            {payments.length > 0 && (
                                <tfoot>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                                        <td colSpan="4" className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase">
                                            Total ({payments.length} transactions)
                                        </td>
                                        <td className="p-4 text-right font-mono font-black text-teal-600 text-base">
                                            ${totalRevenue}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
}