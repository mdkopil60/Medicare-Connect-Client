'use client';
import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@heroui/react';
import { FaUserMd, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function ManageDoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${API_URL}/doctors?admin=true&limit=100`,
                getAuthHeaders()
            );
            setDoctors(res.data.doctors || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleVerify = async (id) => {
        const result = await Swal.fire({
            title: 'Verify this doctor?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            confirmButtonText: 'Yes, Verify!'
        });
        if (!result.isConfirmed) return;
        try {
            await axios.patch(
                `${API_URL}/doctors/verify/${id}`,
                {},
                getAuthHeaders()
            );
            setDoctors(prev =>
                prev.map(d => d._id === id ? { ...d, verificationStatus: 'Verified' } : d)
            );
            Swal.fire({ icon: 'success', title: 'Doctor Verified!', timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire('Error', 'Something went wrong.', 'error');
        }
    };

    const handleReject = async (id) => {
        const result = await Swal.fire({
            title: 'Reject & Remove?',
            text: 'This doctor will be permanently removed!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Remove!'
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(
                `${API_URL}/doctors/reject/${id}`,
                getAuthHeaders()
            );
            setDoctors(prev => prev.filter(d => d._id !== id));
            Swal.fire({ icon: 'success', title: 'Doctor Removed!', timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire('Error', 'Something went wrong.', 'error');
        }
    };

    const filteredDoctors = doctors.filter(d => {
        if (filter === 'All') return true;
        return d.verificationStatus?.toLowerCase() === filter.toLowerCase();
    });

    const pendingCount = doctors.filter(d =>
        d.verificationStatus?.toLowerCase() === 'pending'
    ).length;

    const verifiedCount = doctors.filter(d =>
        d.verificationStatus?.toLowerCase() === 'verified'
    ).length;

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size="lg" color="primary" />
        </div>
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FaUserMd className="text-teal-600" /> Manage Doctors
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                    Review and manage doctor verification status
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-2xl font-black text-slate-700 dark:text-white">
                        {doctors.length}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Total Doctors</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-yellow-100 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-2xl font-black text-yellow-500">{pendingCount}</p>
                    <p className="text-xs text-slate-400 mt-1">Pending Review</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-teal-100 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-2xl font-black text-teal-600">{verifiedCount}</p>
                    <p className="text-xs text-slate-400 mt-1">Verified</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
                {['All', 'Pending', 'Verified'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === tab
                                ? 'bg-teal-600 text-white shadow'
                                : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        {tab}
                        {tab === 'Pending' && pendingCount > 0 && (
                            <span className="ml-1.5 bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Table */}
            <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/70 dark:bg-slate-800 text-slate-500 font-bold text-xs tracking-wider uppercase">
                                <th className="p-4 pl-6">Doctor</th>
                                <th className="p-4">Specialty</th>
                                <th className="p-4">Hospital</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-sm text-slate-400">
                                        No doctors found.
                                    </td>
                                </tr>
                            ) : (
                                filteredDoctors.map(d => (
                                    <tr
                                        key={d._id}
                                        className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 text-sm"
                                    >
                                        {/* Doctor Name */}
                                        <td className="p-4 pl-6 font-semibold text-slate-700 dark:text-slate-200">
                                            {d.doctorName}
                                        </td>

                                        {/* Specialty */}
                                        <td className="p-4 text-slate-500">{d.specialization}</td>

                                        {/* Hospital */}
                                        <td className="p-4 text-slate-500">{d.hospitalName || '—'}</td>

                                        {/* Status */}
                                        <td className="p-4">
                                            {d.verificationStatus?.toLowerCase() === 'verified' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-100">
                                                    <FaCheck className="text-[10px]" /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-100">
                                                    <FaClock className="text-[10px]" /> Pending
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 text-center pr-6">
                                            <div className="flex justify-center items-center gap-2">
                                                {/* ✅ Pending হলে Verify button দেখাও */}
                                                {d.verificationStatus?.toLowerCase() !== 'verified' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-teal-600 text-white rounded-lg font-semibold"
                                                        startContent={<FaCheck />}
                                                        onClick={() => handleVerify(d._id)}
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    className="bg-red-50 text-red-600 rounded-lg font-semibold"
                                                    startContent={<FaTimes />}
                                                    onClick={() => handleReject(d._id)}
                                                >
                                                    Reject
                                                </Button>
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