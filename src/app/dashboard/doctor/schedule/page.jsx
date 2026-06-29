'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button, Card, Spinner } from '@heroui/react';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ManageSchedulePage() {
    const { data: session, isPending } = useSession();
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    const fetchSchedule = async (email) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${API_URL}/doctor/schedule/${email}`,
                getAuthHeaders()
            );
            setSlots(res.data?.availableSlots || []);
        } catch (err) {
            console.error("Error fetching schedule:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isPending) return;
        if (session?.user?.email) {
            fetchSchedule(session.user.email);
        }
    }, [session, isPending]);

    const openSchedulePopup = (slot = null) => {
        const isEditMode = !!slot;
        const email = session?.user?.email || '';

        const dayOptions = DAYS_OF_WEEK.map(day =>
            `<option value="${day}" ${slot?.day === day ? 'selected' : ''}>${day}</option>`
        ).join('');

        Swal.fire({
            title: isEditMode ? 'Modify Availability Slot' : 'Create New Availability Slot',
            html: `
        <div style="text-align: left; font-family: sans-serif;">
          <div style="margin-bottom: 15px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Select Day</label>
            <select id="swal-day" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px;">
              <option value="" disabled ${!slot ? 'selected' : ''}>Choose active work day</option>
              ${dayOptions}
            </select>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Start Time</label>
              <input type="time" id="swal-startTime" value="${slot?.startTime || ''}" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px;" />
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">End Time</label>
              <input type="time" id="swal-endTime" value="${slot?.endTime || ''}" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px;" />
            </div>
          </div>
          <div>
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Max Patients</label>
            <input type="number" id="swal-maxPatients" min="1" value="${slot?.maxPatients || 10}" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px;" />
          </div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: isEditMode ? 'Save Changes' : 'Create Slot',
            cancelButtonText: 'Cancel',
            focusConfirm: false,
            preConfirm: () => {
                const day = document.getElementById('swal-day').value;
                const startTime = document.getElementById('swal-startTime').value;
                const endTime = document.getElementById('swal-endTime').value;
                const maxPatients = document.getElementById('swal-maxPatients').value;
                if (!day || !startTime || !endTime || !maxPatients) {
                    Swal.showValidationMessage('Please fill out all fields');
                    return false;
                }
                return { day, startTime, endTime, maxPatients: parseInt(maxPatients) };
            }
        }).then(async (result) => {
            if (!result.isConfirmed) return;
            try {
                if (isEditMode) {
                    await axios.patch(
                        `${API_URL}/doctor/schedule/slot/${email}/${slot._id}`,
                        result.value,
                        getAuthHeaders()
                    );
                } else {
                    await axios.post(
                        `${API_URL}/doctor/schedule/slot/${email}`,
                        result.value,
                        getAuthHeaders()
                    );
                }
                fetchSchedule(email);
                Swal.fire({ icon: 'success', title: isEditMode ? 'Schedule updated!' : 'Schedule added!', timer: 1500, showConfirmButton: false });
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Operation failed', text: err.response?.data?.message || 'Server error' });
            }
        });
    };

    const handleDelete = (slotId) => {
        const email = session?.user?.email;
        Swal.fire({
            title: 'Are you sure?',
            text: "This time slot will be permanently removed!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(
                        `${API_URL}/doctor/schedule/slot/${email}/${slotId}`,
                        getAuthHeaders()
                    );
                    setSlots(prev => prev.filter(item => item._id !== slotId));
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
                <p className="text-sm text-slate-500 animate-pulse">Loading schedules...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-slate-50/50 dark:bg-slate-950">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <FaCalendarAlt className="text-teal-600" /> Manage Available Schedules
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Configure appointment availability configurations</p>
                </div>
                <Button
                    onClick={() => openSchedulePopup(null)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md"
                    startContent={<FaPlus />}
                >
                    Add Schedule
                </Button>
            </div>

            <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/70 dark:bg-slate-800 text-slate-500 font-bold text-xs tracking-wider uppercase">
                                <th className="p-4 pl-6">Day</th>
                                <th className="p-4">Time Interval</th>
                                <th className="p-4">Max Patients</th>
                                <th className="p-4 text-center pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slots.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-sm text-slate-400">
                                        No active scheduling availability found.
                                    </td>
                                </tr>
                            ) : (
                                slots.map((item) => (
                                    <tr key={item._id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 text-sm">
                                        <td className="p-4 pl-6 font-semibold text-slate-700 dark:text-slate-200">{item.day}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-medium text-xs border border-teal-100/50">
                                                <FaClock className="text-[10px]" /> {item.startTime} - {item.endTime}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-slate-500">{item.maxPatients} Patients</td>
                                        <td className="p-4 text-center pr-6">
                                            <div className="flex justify-center items-center gap-2">
                                                <Button isIconOnly size="sm" variant="flat"
                                                    className="text-amber-600 bg-amber-50 rounded-lg"
                                                    onClick={() => openSchedulePopup(item)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button isIconOnly size="sm" variant="flat"
                                                    className="text-red-600 bg-red-50 rounded-lg"
                                                    onClick={() => handleDelete(item._id)}>
                                                    <FaTrash />
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