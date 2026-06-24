'use client';

import { useState, useEffect } from 'react';
import { Card, Spinner } from '@heroui/react';
import { FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function OverseeAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // 📥 ডাটাবেজ থেকে সকল অ্যাপয়েন্টমেন্ট ডাটা লোড করা
    useEffect(() => {
        const fetchAllAppointments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access-token");
                const res = await axios.get('http://localhost:5000/appointments', {
                    headers: { authorization: `Bearer ${token}` }
                });
                setAppointments(res.data || []);
            } catch (err) {
                console.error("Error fetching central appointments:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Sync Error',
                    text: 'Failed to retrieve central appointment stream.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAllAppointments();
    }, []);

    return (
        <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
            {/* Header section */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <FaCalendarCheck className="text-teal-600 text-lg" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">Live Central Appointment Monitor</h3>
            </div>

            {/* Table or Loader section */}
            <div className="overflow-x-auto w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-8 gap-2">
                        <Spinner size="sm" color="teal" />
                        <p className="text-xs text-slate-400 font-medium">Streaming appointments...</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold text-xs uppercase">
                                <th className="p-3 pl-4">Patient Target</th>
                                <th className="p-3">Assigned Physician</th>
                                <th className="p-3">Schedule Date</th>
                                <th className="p-3 text-right pr-4">Status Tracking</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-xs text-slate-400 italic">
                                        No active live appointments streamed at this moment.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map(apt => (
                                    <tr key={apt._id} className="border-b border-slate-100 dark:border-slate-800/40 last:border-0 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors text-slate-700 dark:text-slate-300">
                                        <td className="p-3 pl-4 font-semibold">{apt.patientName}</td>
                                        <td className="p-3 text-slate-500 dark:text-slate-400 font-medium">{apt.doctorName}</td>
                                        <td className="p-3 font-mono text-xs text-slate-400 dark:text-slate-500">{apt.date}</td>
                                        <td className="p-3 text-right pr-4">
                                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${apt.status === 'Accepted'
                                                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400'
                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                                }`}>
                                                {apt.status}
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