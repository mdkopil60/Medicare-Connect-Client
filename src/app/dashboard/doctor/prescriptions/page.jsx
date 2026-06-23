'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Card } from '@heroui/react';
import { FaPlus, FaEdit, FaTrash, FaFilePrescription, FaUserMd, FaNotesMedical } from 'react-icons/fa';
import Swal from 'sweetalert2';

// ডেমো বা ফেক প্রেসক্রিপশন ডাটা সেট
const INITIAL_PRESCRIPTIONS = [
    { _id: "prc-501", appointmentId: "apt-102", patientName: "Sarah Smith", medicines: "Paracetamol 500mg (1+0+1), Omeprazole 20mg (1+0+1)", diagnosis: "Fever & Gastric issues", instructions: "Take medicines after meals. Rest for 3 days." },
    { _id: "prc-502", appointmentId: "apt-104", patientName: "Emily Davis", medicines: "Cetirizine 10mg (0+0+1)", diagnosis: "Allergic Rhinitis", instructions: "Avoid cold drinks and dust." }
];

export default function PrescriptionManagementPage() {
    const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
    const searchParams = useSearchParams();
    const appointmentIdFromQuery = searchParams.get('appointmentId');

    // যদি অ্যাপয়েন্টমেন্ট পেজ থেকে কোনো আইডি নিয়ে আসে, তাহলে সরাসরি নিউ প্রেসক্রিপশন পপআপ ওপেন হবে
    useEffect(() => {
        if (appointmentIdFromQuery) {
            // একটু ডিলে দিয়ে পপআপ ওপেন করা হচ্ছে যাতে পেজ লোড কমপ্লিট হয়
            const timer = setTimeout(() => {
                openPrescriptionPopup({ appointmentId: appointmentIdFromQuery, isAutoOpen: true });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [appointmentIdFromQuery]);

    // Create & Update Popup Handler
    const openPrescriptionPopup = (prescription = null) => {
        const isEditMode = prescription && !prescription.isAutoOpen;

        Swal.fire({
            title: isEditMode ? 'Update Prescription' : 'Create New Prescription',
            html: `
        <div style="text-align: left; font-family: sans-serif;">
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Patient Name</label>
            <input type="text" id="swal-pName" value="${prescription?.patientName || ''}" placeholder="e.g. John Doe" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
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
                const appointmentId = document.getElementById('swal-aptId').value;
                const diagnosis = document.getElementById('swal-diagnosis').value;
                const medicines = document.getElementById('swal-medicines').value;
                const instructions = document.getElementById('swal-instructions').value;

                if (!patientName || !diagnosis || !medicines) {
                    Swal.showValidationMessage('Patient Name, Diagnosis, and Medicines are required');
                    return false;
                }
                return { patientName, appointmentId, diagnosis, medicines, instructions };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const data = result.value;

                if (isEditMode) {
                    // UPDATE PRESCRIPTION (State Update)
                    setPrescriptions(prev => prev.map(item =>
                        item._id === prescription._id ? { ...data, _id: prescription._id } : item
                    ));
                    Swal.fire({ icon: 'success', title: 'Prescription updated successfully!', timer: 1500, showConfirmButton: false });
                } else {
                    // CREATE PRESCRIPTION (State Add)
                    const newPrescription = { ...data, _id: Date.now().toString() };
                    setPrescriptions(prev => [...prev, newPrescription]);
                    Swal.fire({ icon: 'success', title: 'Prescription issued successfully!', timer: 1500, showConfirmButton: false });
                }
            }
        });
    };

    // Delete Prescription Function
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This prescription record will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setPrescriptions(prev => prev.filter(item => item._id !== id));
                Swal.fire('Deleted!', 'The prescription record has been removed.', 'success');
            }
        });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                        <FaFilePrescription className="text-teal-600" /> Prescription Management
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1">Create, view, and modify past patient prescriptions</p>
                </div>
                <Button
                    onPress={() => openPrescriptionPopup(null)}
                    color="primary"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/10"
                    startContent={<FaPlus />}
                >
                    New Prescription
                </Button>
            </div>

            {/* Grid Layout of Prescriptions for Better UI Appearance */}
            {prescriptions.length === 0 ? (
                <Card className="border border-slate-100 dark:border-slate-800 p-8 text-center text-sm text-slate-400 bg-white dark:bg-slate-900 rounded-2xl">
                    No prescription records found.
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prescriptions.map((item) => (
                        <Card key={item._id} className="border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-2xl bg-white dark:bg-slate-900 flex flex-col justify-between overflow-hidden">

                            {/* Card Header */}
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <FaNotesMedical className="text-teal-600 text-sm" /> {item.patientName}
                                    </h3>
                                    {item.appointmentId && (
                                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Apt ID: {item.appointmentId}</p>
                                    )}
                                </div>
                                <span className="text-[10px] bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 font-bold px-2 py-0.5 rounded border border-teal-100/30">
                                    {item._id}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-4 flex-grow text-sm">
                                <div>
                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</span>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-100/60 dark:border-slate-800/40">
                                        {item.diagnosis}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rx / Medicines</span>
                                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-mono text-xs bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                        {item.medicines}
                                    </p>
                                </div>

                                {item.instructions && (
                                    <div>
                                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Instructions</span>
                                        <p className="text-xs text-slate-500 italic dark:text-slate-400">{item.instructions}</p>
                                    </div>
                                )}
                            </div>

                            {/* Card Actions Footer */}
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-end gap-2">
                                <Button
                                    size="sm"
                                    variant="flat"
                                    className="text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-100/40 dark:border-amber-900/30 font-bold rounded-lg px-3"
                                    startContent={<FaEdit />}
                                    onPress={() => openPrescriptionPopup(item)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="flat"
                                    className="text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100/40 dark:border-red-900/30 font-bold rounded-lg px-3"
                                    startContent={<FaTrash />}
                                    onPress={() => handleDelete(item._id)}
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