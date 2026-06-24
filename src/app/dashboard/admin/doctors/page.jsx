'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@heroui/react';
import { FaUserMd, FaCheck, FaTimes, FaBan } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ManageDoctorsPage() {
    const [doctors, setDoctors] = useState([]); // Initialized as empty array
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/doctors', getAuthHeaders());

            // FIX: Ensure we are setting an array. 
            // If your API returns { data: [...] }, change to res.data.data
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setDoctors(data);
        } catch (err) {
            console.error("Error loading doctors list:", err);
            setDoctors([]);
            Swal.fire({ icon: 'error', title: 'Failed to sync physician profiles' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDoctorVerification = (id, action) => {
        let title = action === 'verify' ? 'Verify Credentials?' : (action === 'reject' ? 'Reject Application?' : 'Revoke Verification?');
        let confirmColor = action === 'verify' ? '#0d9488' : '#ef4444';

        Swal.fire({
            title,
            text: "Update specific medical practitioner governance entry?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: confirmColor,
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Confirm'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    if (action === 'reject') {
                        await axios.delete(`http://localhost:5000/doctors/reject/${id}`, getAuthHeaders());
                        setDoctors(prev => prev.filter(d => d._id !== id));
                        Swal.fire('Rejected', 'Application discarded.', 'info');
                    } else {
                        const isVerified = action === 'verify';
                        const res = await axios.patch(`http://localhost:5000/doctors/verify/${id}`, { verified: isVerified }, getAuthHeaders());

                        setDoctors(prev => prev.map(d => d._id === id ? { ...d, verified: res.data.verified } : d));
                        Swal.fire('Success!', 'Status updated.', 'success');
                    }
                } catch (err) {
                    Swal.fire({ icon: 'error', title: 'Operation failed' });
                }
            }
        });
    };

    return (
        <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <FaUserMd className="text-teal-600 text-lg" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">Physician Verification & Credentials Audit</h3>
            </div>

            <div className="overflow-x-auto w-full">
                {loading ? (
                    <div className="flex justify-center p-10"><Spinner color="teal" /></div>
                ) : (
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold text-xs uppercase">
                                <th className="p-3 pl-4">Doctor</th>
                                <th className="p-3">Specialty</th>
                                <th className="p-3">Compliance</th>
                                <th className="p-3 text-center pr-4">Verification Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* SAFETY CHECK: Ensuring doctors is an array before mapping */}
                            {Array.isArray(doctors) && doctors.length > 0 ? (
                                doctors.map(d => (
                                    <tr key={d._id} className="border-b border-slate-100 dark:border-slate-800/40 last:border-0 text-slate-700 dark:text-slate-300">
                                        <td className="p-3 pl-4">
                                            <p className="font-semibold">{d.name}</p>
                                            <p className="text-xs text-slate-400">{d.email}</p>
                                        </td>
                                        <td className="p-3 text-sm font-medium text-slate-500 dark:text-slate-400">{d.specialty}</td>
                                        <td className="p-3 text-xs">
                                            <span className={`px-2 py-0.5 rounded font-bold ${d.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {d.verified ? 'Verified Active' : 'Pending Review'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center pr-4">
                                            <div className="flex justify-center items-center gap-2">
                                                {!d.verified ? (
                                                    <>
                                                        <Button size="sm" variant="flat" onPress={() => handleDoctorVerification(d._id, 'verify')} className="text-teal-600 bg-teal-50">Verify</Button>
                                                        <Button size="sm" variant="flat" onPress={() => handleDoctorVerification(d._id, 'reject')} className="text-red-600 bg-red-50">Reject</Button>
                                                    </>
                                                ) : (
                                                    <Button size="sm" variant="flat" onPress={() => handleDoctorVerification(d._id, 'cancel')} className="text-red-600 bg-red-50">Cancel Verification</Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center p-4">No doctors found.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}