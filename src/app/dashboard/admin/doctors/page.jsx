'use client';
import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@heroui/react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ManageDoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/doctors');
            setDoctors(res.data.doctors);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleAction = async (id, action) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to ${action} this doctor.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'verify' ? '#0d9488' : '#ef4444',
            confirmButtonText: 'Yes, proceed!'
        });

        if (result.isConfirmed) {
            try {
                if (action === 'reject') {
                    await axios.delete(`http://localhost:5000/doctors/reject/${id}`);
                    setDoctors(doctors.filter(d => d._id !== id));
                    Swal.fire('Deleted!', 'Doctor removed.', 'success');
                } else {
                    const status = action === 'verify';
                    await axios.patch(`http://localhost:5000/doctors/verify/${id}`, { verified: status });
                    fetchDoctors(); // ডাটা রিফ্রেশ করা
                    Swal.fire('Updated!', 'Status changed successfully.', 'success');
                }
            } catch (err) {
                Swal.fire('Error', 'Something went wrong.', 'error');
            }
        }
    };

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Manage Doctors</h2>
            {loading ? <Spinner /> : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3">Doctor</th>
                            <th className="p-3">Specialty</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(d => (
                            <tr key={d._id} className="border-b">
                                <td className="p-3">{d.doctorName}</td>
                                <td className="p-3">{d.specialization}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${d.verificationStatus === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {d.verificationStatus}
                                    </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    {d.verificationStatus !== 'Verified' && (
                                        <Button size="sm" color="success" onClick={() => handleAction(d._id, 'verify')}>Verify</Button>
                                    )}
                                    <Button size="sm" color="danger" onClick={() => handleAction(d._id, 'reject')}>Reject</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Card>
    );
}