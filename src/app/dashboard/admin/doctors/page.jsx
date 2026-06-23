'use client';

import { useState } from 'react';
import { Card, Button } from '@heroui/react';
import { FaUserMd, FaCheck, FaTimes, FaBan } from 'react-icons/fa';
import Swal from 'sweetalert2';

const INITIAL_DOCTORS = [
    { _id: "doc-01", name: "Dr. Robert Johnson", email: "robert@med.com", specialty: "Neurologist", verified: false },
    { _id: "doc-02", name: "Dr. Clara Oswald", email: "clara@med.com", specialty: "Gynecologist", verified: true },
    { _id: "doc-03", name: "Dr. Bruce Banner", email: "bruce@med.com", specialty: "Hematologist", verified: false }
];

export default function ManageDoctorsPage() {
    const [doctors, setDoctors] = useState(INITIAL_DOCTORS);

    const handleDoctorVerification = (id, action) => {
        let title = action === 'verify' ? 'Verify Credentials?' : (action === 'reject' ? 'Reject Application?' : 'Revoke Verification?');

        Swal.fire({
            title,
            text: "Update specific medical practitioner governance entry?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: action === 'verify' ? '#0d9488' : '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Confirm'
        }).then((result) => {
            if (result.isConfirmed) {
                if (action === 'reject') {
                    setDoctors(prev => prev.filter(d => d._id !== id));
                    Swal.fire('Rejected', 'Application discarded.', 'info');
                } else {
                    const isVerified = action === 'verify';
                    setDoctors(prev => prev.map(d => d._id === id ? { ...d, verified: isVerified } : d));
                    Swal.fire('Success!', 'Doctor compliance status updated.', 'success');
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
                        {doctors.map(d => (
                            <tr key={d._id} className="border-b border-slate-100 dark:border-slate-800/40 last:border-0 text-slate-700 dark:text-slate-300">
                                <td className="p-3 pl-4">
                                    <p className="font-semibold">{d.name}</p>
                                    <p className="text-xs text-slate-400">{d.email}</p>
                                </td>
                                <td className="p-3 text-sm font-medium text-slate-500">{d.specialty}</td>
                                <td className="p-3 text-xs">
                                    <span className={`px-2 py-0.5 rounded font-bold ${d.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {d.verified ? 'Verified Active' : 'Pending Review'}
                                    </span>
                                </td>
                                <td className="p-3 text-center pr-4">
                                    <div className="flex justify-center items-center gap-2">
                                        {!d.verified ? (
                                            <>
                                                <Button size="sm" variant="flat" className="text-teal-600 bg-teal-50 border border-teal-100 rounded-lg px-2.5 font-bold text-xs" startContent={<FaCheck />} onPress={() => handleDoctorVerification(d._id, 'verify')}>Verify</Button>
                                                <Button size="sm" variant="flat" className="text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 font-bold text-xs" startContent={<FaTimes />} onPress={() => handleDoctorVerification(d._id, 'reject')}>Reject</Button>
                                            </>
                                        ) : (
                                            <Button size="sm" variant="flat" className="text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 font-bold text-xs" startContent={<FaBan />} onPress={() => handleDoctorVerification(d._id, 'cancel')}>Cancel Verification</Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}