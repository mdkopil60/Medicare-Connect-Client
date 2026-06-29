'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client'; // ✅ Better Auth
import { Button, Card, Spinner } from '@heroui/react';
import { FaPlus, FaEdit, FaTrash, FaFilePrescription, FaNotesMedical } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function PrescriptionManagementPage() {
    const { data: session, isPending } = useSession(); 
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const appointmentIdFromQuery = searchParams.get('appointmentId');

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    const fetchPrescriptions = async (email) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${API_URL}/prescriptions?doctorEmail=${email}`, 
                getAuthHeaders()
            );
            setPrescriptions(res.data || []);
        } catch (err) {
            console.error("Error fetching prescriptions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isPending) return;
        if (session?.user?.email) {
            fetchPrescriptions(session.user.email);
        }
    }, [session, isPending]);

    // appointmentId query থেকে এলে auto popup
    useEffect(() => {
        if (appointmentIdFromQuery && !loading) {
            const timer = setTimeout(() => {
                openPrescriptionPopup({ appointmentId: appointmentIdFromQuery, isAutoOpen: true });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [appointmentIdFromQuery, loading]);

    const openPrescriptionPopup = (prescription = null) => {
        const isEditMode = prescription && !prescription.isAutoOpen;
        const email = session?.user?.email || '';

        Swal.fire({
            title: isEditMode ? 'Update Prescription' : 'Create New Prescription',
            html: `
        <div style="text-align: left; font-family: sans-serif;">
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Patient Name</label>
            <input type="text" id="swal-pName" value="${prescription?.patientName || ''}" placeholder="e.g. John Doe" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Patient Email</label>
            <input type="text" id="swal-pEmail" value="${prescription?.patientEmail || ''}" placeholder="e.g. patient@email.com" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Appointment ID (Optional)</label>
            <input type="text" id="swal-aptId" value="${prescription?.appointmentId || ''}" placeholder="e.g. apt-101" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Diagnosis / Chief Complaints</label>
            <input type="text" id="swal-diagnosis" value="${prescription?.diagnosis || ''}" placeholder="e.g. Hypertension, Viral Fever" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Medicines (Name & Dosage)</label>
            <textarea id="swal-medicines" placeholder="e.g. Napa Extend (1+0+1), Seclo 20mg (1-0-1)" style="width:100%; height:80px; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none; resize: none;">${prescription?.medicines || ''}</textarea>
          </div>
          <div>
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Special Instructions</label>
            <textarea id="swal-instructions" placeholder="e.g. Take plenty of fluids, review after 7 days" style="width:100%; height:60px; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none; resize: none;">${prescription?.instructions || ''}</textarea>
          </div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: isEditMode ? 'Save Changes' : 'Issue Prescription',
            cancelButtonText: 'Cancel',
            focusConfirm: false,
            preConfirm: () => {
                const patientName = document.getElementById('swal-pName').value;
                const patientEmail = document.getElementById('swal-pEmail').value;
                const appointmentId = document.getElementById('swal-aptId').value;
                const diagnosis = document.getElementById('swal-diagnosis').value;
                const medicines = document.getElementById('swal-medicines').value;
                const instructions = document.getElementById('swal-instructions').value;

                if (!patientName || !diagnosis || !medicines) {
                    Swal.showValidationMessage('Patient Name, Diagnosis, and Medicines are required');
                    return false;
                }
                return { patientName, patientEmail, appointmentId, diagnosis, medicines, instructions };
            }
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            const payload = {
                ...result.value,
                doctorEmail: email, 
            };

            try {
                if (isEditMode) {
                    await axios.patch(
                        `${API_URL}/prescriptions/${prescription._id}`,
                        payload,
                        getAuthHeaders()
                    );
                    // re-fetch করো updated data পেতে
                    fetchPrescriptions(email);
                    Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false });
                } else {
                    const res = await axios.post(
                        `${API_URL}/prescriptions`,
                        payload,
                        getAuthHeaders()
                    );
                    if (res.data.insertedId) {
                        fetchPrescriptions(email); // re-fetch
                        Swal.fire({ icon: 'success', title: 'Prescription issued!', timer: 1500, showConfirmButton: false });
                    }
                }
            } catch (err) {
                console.error("Error saving prescription:", err);
                Swal.fire({ icon: 'error', title: 'Operation failed', text: err.response?.data?.message || 'Server error' });
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/prescriptions/${id}`, getAuthHeaders());
                    setPrescriptions(prev => prev.filter(item => item._id !== id));
                    Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
                } catch (err) {
                    Swal.fire({ icon: 'error', title: 'Delete failed' });
                }
            }
        });
    };

    if (isPending || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Spinner size="lg" color="primary" />
                <p className="text-sm text-slate-500 animate-pulse">Loading prescription records...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-slate-50/50 dark:bg-slate-950">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <FaFilePrescription className="text-teal-600" /> Prescription Management
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Create, view, and modify past patient prescriptions</p>
                </div>
                <Button
                    onClick={() => openPrescriptionPopup(null)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md"
                    startContent={<FaPlus />}
                >
                    New Prescription
                </Button>
            </div>

            {prescriptions.length === 0 ? (
                <Card className="border border-slate-100 dark:border-slate-800 p-8 text-center text-sm text-slate-400 rounded-2xl">
                    No prescription records found.
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prescriptions.map((item) => (
                        <Card key={item._id} className="border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-2xl bg-white dark:bg-slate-900 flex flex-col justify-between overflow-hidden">
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <FaNotesMedical className="text-teal-600 text-sm" /> {item.patientName}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{item.patientEmail}</p>
                                    {item.appointmentId && (
                                        <p className="text-[11px] text-slate-400 mt-0.5">Apt: {item.appointmentId}</p>
                                    )}
                                </div>
                                <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded border border-teal-100/30">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="p-5 space-y-4 flex-grow text-sm">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</span>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-100/60">
                                        {item.diagnosis}
                                    </p>
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rx / Medicines</span>
                                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line font-mono text-xs bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">
                                        {item.medicines}
                                    </p>
                                </div>
                                {item.instructions && (
                                    <div>
                                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Instructions</span>
                                        <p className="text-xs text-slate-500 italic">{item.instructions}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                                <Button
                                    size="sm"
                                    variant="flat"
                                    className="text-amber-600 bg-amber-50 font-bold rounded-lg"
                                    startContent={<FaEdit />}
                                    onClick={() => openPrescriptionPopup(item)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="flat"
                                    className="text-red-600 bg-red-50 font-bold rounded-lg"
                                    startContent={<FaTrash />}
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}