'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@heroui/react';
import { FaCalendarCheck, FaTrash, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_STYLES = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    confirmed: 'bg-teal-50 text-teal-700 border-teal-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
    completed: 'bg-blue-50 text-blue-700 border-blue-100',
};

const STATUS_ICONS = {
    pending: <FaClock className="text-[10px]" />,
    confirmed: <FaCheck className="text-[10px]" />,
    cancelled: <FaTimes className="text-[10px]" />,
    completed: <FaCheck className="text-[10px]" />,
};

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/appointments`, getAuthHeaders());
            setAppointments(res.data || []);
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Failed to load appointments' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, []);

    const handleStatusChange = async (id, newStatus) => {
        const result = await Swal.fire({
            title: `Mark as ${newStatus}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            confirmButtonText: 'Yes, update!'
        });
        if (!result.isConfirmed) return;
        try {
            await axios.patch(
                `${API_URL}/appointments/status/${id}`,
                { status: newStatus },
                getAuthHeaders()
            );
            setAppointments(prev =>
                prev.map(a => a._id === id ? { ...a, appointmentStatus: newStatus } : a)
            );
            Swal.fire({ icon: 'success', title: 'Status updated!', timer: 1200, showConfirmButton: false });
        } catch {
            Swal.fire('Error', 'Update failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete appointment?',
            text: 'This cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete!'
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(`${API_URL}/appointments/${id}`, getAuthHeaders());
            setAppointments(prev => prev.filter(a => a._id !== id));
            Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1200, showConfirmButton: false });
        } catch {
            Swal.fire('Error', 'Delete failed', 'error');
        }
    };

    const filtered = filter === 'all'
        ? appointments
        : appointments.filter(a => a.appointmentStatus === filter);

    // Stats
    const counts = {
        all: appointments.length,
        pending: appointments.filter(a => a.appointmentStatus === 'pending').length,
        confirmed: appointments.filter(a => a.appointmentStatus === 'confirmed').length,
        cancelled: appointments.filter(a => a.appointmentStatus === 'cancelled').length,
        completed: appointments.filter(a => a.appointmentStatus === 'completed').length,
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size="lg" color="primary" />
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FaCalendarCheck className="text-teal-600" /> All Appointments
                </h2>
                <p className="text-xs text-slate-400 mt-1">Manage and monitor all patient appointments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total', key: 'all', color: 'text-slate-700' },
                    { label: 'Pending', key: 'pending', color: 'text-yellow-500' },
                    { label: 'Confirmed', key: 'confirmed', color: 'text-teal-600' },
                    { label: 'Cancelled', key: 'cancelled', color: 'text-red-500' },
                ].map(({ label, key, color }) => (
                    <div key={key} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                        <p className={`text-2xl font-black ${color}`}>{counts[key]}</p>
                        <p className="text-xs text-slate-400 mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${filter === tab
                                ? 'bg-teal-600 text-white shadow'
                                : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        {tab}
                        {tab === 'pending' && counts.pending > 0 && (
                            <span className="ml-1.5 bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {counts.pending}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Table */}
            <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-100/70 dark:bg-slate-800 text-slate-500 font-bold text-xs tracking-wider uppercase">
                                <th className="p-4 pl-6">#</th>
                                <th className="p-4">Patient</th>
                                <th className="p-4">Doctor ID</th>
                                <th className="p-4">Date & Time</th>
                                <th className="p-4">Symptoms</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center text-sm text-slate-400">
                                        No appointments found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((apt, idx) => {
                                    const status = apt.appointmentStatus?.toLowerCase() || 'pending';
                                    return (
                                        <tr key={apt._id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 text-sm">
                                            <td className="p-4 pl-6 text-slate-400 font-mono text-xs">{idx + 1}</td>
                                            <td className="p-4 font-semibold text-slate-700 dark:text-slate-200">
                                                {apt.patientName || apt.patientId || '—'}
                                            </td>
                                            <td className="p-4 font-mono text-xs text-slate-400">
                                                {apt.doctorId?.toString().slice(-8) || '—'}
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                <div>{apt.appointmentDate}</div>
                                                <div className="text-xs text-slate-400">{apt.appointmentTime}</div>
                                            </td>
                                            <td className="p-4 text-slate-400 text-xs max-w-[120px] truncate">
                                                {apt.symptoms || '—'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
                                                    {STATUS_ICONS[status]} {status}
                                                </span>
                                            </td>
                                            <td className="p-4 pr-6">
                                                <div className="flex justify-center items-center gap-1.5">
                                                    {status === 'pending' && (
                                                        <Button size="sm"
                                                            className="bg-teal-600 text-white rounded-lg text-xs font-semibold"
                                                            onClick={() => handleStatusChange(apt._id, 'confirmed')}>
                                                            Confirm
                                                        </Button>
                                                    )}
                                                    {(status === 'pending' || status === 'confirmed') && (
                                                        <Button size="sm"
                                                            className="bg-red-50 text-red-600 rounded-lg text-xs font-semibold"
                                                            onClick={() => handleStatusChange(apt._id, 'cancelled')}>
                                                            Cancel
                                                        </Button>
                                                    )}
                                                    <Button isIconOnly size="sm" variant="flat"
                                                        className="text-slate-400 bg-slate-50 rounded-lg"
                                                        onClick={() => handleDelete(apt._id)}>
                                                        <FaTrash className="text-xs" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}