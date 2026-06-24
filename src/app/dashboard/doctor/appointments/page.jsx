'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Spinner } from '@heroui/react';
import { FaCheck, FaTimes, FaFilePrescription, FaUser, FaCalendarCheck, FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function AppointmentRequestsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 🔑 সিকিউরিটি হেডার গেটার মেথড
    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    // 📥 ১. ডাটাবেজ থেকে অ্যাপয়েন্টমেন্ট ডাটা লোড করা
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            // আপনার ব্যাকএন্ড রাউট অনুযায়ী URL পরিবর্তন করে নিতে পারেন
            const res = await axios.get('http://localhost:5000/appointments/doctor', getAuthHeaders());
            setAppointments(res.data || []);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            Swal.fire({ icon: 'error', title: 'Failed to load appointments' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // ⚙️ ব্যাকএন্ডে স্ট্যাটাস আপডেট করার কমন হেল্পার ফাংশন
    const updateAppointmentStatus = async (id, status) => {
        try {
            await axios.patch(`http://localhost:5000/appointments/${id}`, { status }, getAuthHeaders());
            // রিয়েল-টাইম ইউজার এক্সপেরিয়েন্সের জন্য লোকাল স্টেট আপডেট
            setAppointments(prev => prev.map(apt =>
                apt._id === id ? { ...apt, status } : apt
            ));
            return true;
        } catch (err) {
            console.error(`Error updating status to ${status}:`, err);
            Swal.fire({ icon: 'error', title: 'Action failed', text: err.response?.data?.message || 'Something went wrong.' });
            return false;
        }
    };

    // 🟢 ২. অ্যাপয়েন্টমেন্ট অ্যাকসেপ্ট হ্যান্ডলার
    const handleAccept = (id) => {
        Swal.fire({
            title: 'Accept Appointment?',
            text: "Are you sure you want to accept this request?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Accept',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await updateAppointmentStatus(id, 'Accepted');
                if (success) {
                    Swal.fire({ icon: 'success', title: 'Appointment accepted!', timer: 1500, showConfirmButton: false });
                }
            }
        });
    };

    // 🔴 ৩. অ্যাপয়েন্টমেন্ট রিজেক্ট হ্যান্ডলার
    const handleReject = (id) => {
        Swal.fire({
            title: 'Reject Appointment?',
            text: "This request will be marked as rejected.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Reject',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await updateAppointmentStatus(id, 'Rejected');
                if (success) {
                    Swal.fire({ icon: 'error', title: 'Appointment rejected.', timer: 1500, showConfirmButton: false });
                }
            }
        });
    };

    // 🔵 ৪. অ্যাপয়েন্টমেন্ট কমপ্লিট ও প্রেসক্রিপশন রাউটিং
    const handleComplete = (id) => {
        Swal.fire({
            title: 'Mark as Completed?',
            text: "Once completed, you will be redirected to the prescription page.",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Complete',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await updateAppointmentStatus(id, 'Completed');
                if (success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Appointment Completed!',
                        text: 'Opening prescription form...',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        router.push(`/dashboard/doctor/prescriptions?appointmentId=${id}`);
                    });
                }
            }
        });
    };

    const getStatusBadge = (status) => {
        const baseClass = "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ";
        switch (status) {
            case 'Pending':
                return `${baseClass} bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30`;
            case 'Accepted':
                return `${baseClass} bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900/30`;
            case 'Rejected':
                return `${baseClass} bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30`;
            case 'Completed':
                return `${baseClass} bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30`;
            default:
                return `${baseClass} bg-slate-50 text-slate-700 border-slate-100`;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Spinner size="lg" color="teal" />
                <p className="text-sm text-slate-500 font-medium animate-pulse">Syncing appointment schedules...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <FaCalendarCheck className="text-teal-600" /> Appointment Requests
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">Manage, approve, and complete your incoming patient appointments</p>
            </div>

            <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/70 dark:bg-slate-800 text-slate-500 font-bold text-xs tracking-wider uppercase">
                                <th className="p-4 pl-6">Patient</th>
                                <th className="p-4">Schedule</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-sm text-slate-400">No appointment requests available.</td>
                                </tr>
                            ) : (
                                appointments.map((apt) => (
                                    <tr key={apt._id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 text-sm">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                    <FaUser className="text-xs" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{apt.patientName || apt.userId?.name}</p>
                                                    <p className="text-xs text-slate-400">Age: {apt.age || apt.userId?.age || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-slate-600 dark:text-slate-300">{apt.date}</p>
                                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                                <FaClock className="text-[10px]" /> {apt.time}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={getStatusBadge(apt.status)}>{apt.status}</span>
                                        </td>
                                        <td className="p-4 text-center pr-6">
                                            <div className="flex justify-center items-center gap-2">
                                                {apt.status === 'Pending' && (
                                                    <>
                                                        <Button size="sm" variant="flat" className="text-teal-600 bg-teal-50 dark:bg-teal-950/30 border border-teal-100/50 dark:border-teal-900/30 font-bold rounded-lg px-3 cursor-pointer" startContent={<FaCheck className="text-xs" />} onPress={() => handleAccept(apt._id)}>Accept</Button>
                                                        <Button size="sm" variant="flat" className="text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100/50 dark:border-red-900/30 font-bold rounded-lg px-3 cursor-pointer" startContent={<FaTimes className="text-xs" />} onPress={() => handleReject(apt._id)}>Reject</Button>
                                                    </>
                                                )}
                                                {apt.status === 'Accepted' && (
                                                    <Button size="sm" color="primary" className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg px-4 shadow-sm cursor-pointer" startContent={<FaFilePrescription />} onPress={() => handleComplete(apt._id)}>Mark Completed</Button>
                                                )}
                                                {(apt.status === 'Completed' || apt.status === 'Rejected') && (
                                                    <span className="text-xs font-medium text-slate-400 italic">No actions required</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}