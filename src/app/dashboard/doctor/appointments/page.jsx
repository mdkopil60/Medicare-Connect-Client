'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Button, Card, Spinner } from '@heroui/react';
import { FaCheck, FaTimes, FaFilePrescription, FaUser, FaCalendarCheck, FaClock, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function AppointmentRequestsPage() {
    const { data: session, isPending } = useSession();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    const fetchAppointments = async (email) => {
        try {
            setLoading(true);
            setError(null);

            // ✅ verifyToken ছাড়া সরাসরি fetch
            const res = await axios.get(
                `http://localhost:5000/doctor/appointments/${encodeURIComponent(email)}`,
                getAuthHeaders()
            );
            setAppointments(res.data || []);
        } catch (err) {
            console.error("Fetch error:", err.response?.status, err.response?.data);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isPending) return;
        const email = session?.user?.email;
        if (email) {
            fetchAppointments(email);
        } else if (!isPending) {
            setLoading(false);
            setError("No session found. Please login.");
        }
    }, [session, isPending]);

    const updateAppointmentStatus = async (id, status) => {
        try {
            const res = await axios.patch(
                `http://localhost:5000/appointments/status/${id}`,
                { status },
                getAuthHeaders()
            );
            if (res.data.modifiedCount > 0) {
                setAppointments(prev =>
                    prev.map(apt => apt._id === id ? { ...apt, appointmentStatus: status } : apt)
                );
                return true;
            }
            return false;
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Action failed',
                text: err.response?.data?.message || err.message
            });
            return false;
        }
    };

    const handleAccept = (id) => {
        Swal.fire({
            title: 'Accept Appointment?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            confirmButtonText: 'Yes, Accept',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await updateAppointmentStatus(id, 'confirmed');
                if (success) Swal.fire({ icon: 'success', title: 'Accepted!', timer: 1500, showConfirmButton: false });
            }
        });
    };

    const handleReject = (id) => {
        Swal.fire({
            title: 'Reject Appointment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Reject',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await updateAppointmentStatus(id, 'cancelled');
                if (success) Swal.fire({ icon: 'info', title: 'Rejected.', timer: 1500, showConfirmButton: false });
            }
        });
    };

    const handleComplete = (id) => {
        Swal.fire({
            title: 'Mark as Completed?',
            text: "You will be redirected to the prescription page.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            confirmButtonText: 'Yes, Complete',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await updateAppointmentStatus(id, 'completed');
                if (success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Completed!',
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
        const base = "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ";
        const map = {
            pending: `${base} bg-amber-50 text-amber-700 border-amber-100`,
            confirmed: `${base} bg-teal-50 text-teal-700 border-teal-100`,
            cancelled: `${base} bg-red-50 text-red-700 border-red-100`,
            completed: `${base} bg-blue-50 text-blue-700 border-blue-100`,
        };
        return map[status?.toLowerCase()] || `${base} bg-slate-50 text-slate-700 border-slate-100`;
    };

    // Loading
    if (isPending || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Spinner size="lg" color="primary" />
                <p className="text-sm text-slate-500 animate-pulse">Loading appointments...</p>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
                <div className="p-5 bg-red-50 rounded-full">
                    <FaExclamationCircle className="text-red-400 text-3xl" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Failed to load appointments
                </p>
                <p className="text-xs text-red-400 font-mono bg-red-50 px-3 py-1.5 rounded-lg">
                    {error}
                </p>
                <button
                    onClick={() => fetchAppointments(session?.user?.email)}
                    className="px-5 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Stats
    const pending = appointments.filter(a => a.appointmentStatus === 'pending').length;
    const confirmed = appointments.filter(a => a.appointmentStatus === 'confirmed').length;
    const completed = appointments.filter(a => a.appointmentStatus === 'completed').length;

    return (
        <div className="p-6 max-w-6xl mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FaCalendarCheck className="text-teal-600" /> Appointment Requests
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                    Total {appointments.length} appointments
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-amber-100 shadow-sm text-center">
                    <p className="text-2xl font-black text-amber-500">{pending}</p>
                    <p className="text-xs text-slate-400 mt-1">Pending</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-teal-100 shadow-sm text-center">
                    <p className="text-2xl font-black text-teal-600">{confirmed}</p>
                    <p className="text-xs text-slate-400 mt-1">Confirmed</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-blue-100 shadow-sm text-center">
                    <p className="text-2xl font-black text-blue-600">{completed}</p>
                    <p className="text-xs text-slate-400 mt-1">Completed</p>
                </div>
            </div>

            {/* Table */}
            <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/70 dark:bg-slate-800 text-slate-500 font-bold text-xs tracking-wider uppercase">
                                <th className="p-4 pl-6">Patient</th>
                                <th className="p-4">Schedule</th>
                                <th className="p-4">Symptoms</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-sm text-slate-400">
                                        No appointment requests available.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((apt) => (
                                    <tr
                                        key={apt._id}
                                        className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 text-sm"
                                    >
                                        {/* Patient */}
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
                                                    <FaUser className="text-xs text-teal-500" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                                                        {apt.patientName || apt.patientEmail || apt.patientId || '—'}
                                                    </p>
                                                    {apt.patientEmail && (
                                                        <p className="text-xs text-slate-400">{apt.patientEmail}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Schedule */}
                                        <td className="p-4">
                                            <p className="font-medium text-slate-600 dark:text-slate-300">
                                                {apt.appointmentDate}
                                            </p>
                                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                                <FaClock className="text-[10px]" /> {apt.appointmentTime}
                                            </span>
                                        </td>

                                        {/* Symptoms */}
                                        <td className="p-4 text-slate-500 text-xs max-w-[120px] truncate">
                                            {apt.symptoms || '—'}
                                        </td>

                                        {/* Status */}
                                        <td className="p-4">
                                            <span className={getStatusBadge(apt.appointmentStatus)}>
                                                {apt.appointmentStatus}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 text-center pr-6">
                                            <div className="flex justify-center items-center gap-2">
                                                {apt.appointmentStatus === 'pending' && (
                                                    <>
                                                        <Button size="sm" variant="flat"
                                                            className="text-teal-600 bg-teal-50 font-bold rounded-lg"
                                                            startContent={<FaCheck className="text-xs" />}
                                                            onClick={() => handleAccept(apt._id)}>
                                                            Accept
                                                        </Button>
                                                        <Button size="sm" variant="flat"
                                                            className="text-red-600 bg-red-50 font-bold rounded-lg"
                                                            startContent={<FaTimes className="text-xs" />}
                                                            onClick={() => handleReject(apt._id)}>
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {apt.appointmentStatus === 'confirmed' && (
                                                    <Button size="sm"
                                                        className="bg-teal-600 text-white font-bold rounded-lg"
                                                        startContent={<FaFilePrescription />}
                                                        onClick={() => handleComplete(apt._id)}>
                                                        Complete
                                                    </Button>
                                                )}
                                                {(apt.appointmentStatus === 'completed' || apt.appointmentStatus === 'cancelled') && (
                                                    <span className="text-xs text-slate-400 italic">No actions</span>
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