'use client';

import { useState } from 'react';
import { Button, Card } from '@heroui/react';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const INITIAL_SCHEDULES = [
    { _id: "1", day: "Monday", startTime: "09:00", endTime: "13:00", maxPatients: 12 },
    { _id: "2", day: "Tuesday", startTime: "14:00", endTime: "18:00", maxPatients: 10 },
    { _id: "3", day: "Wednesday", startTime: "08:30", endTime: "12:30", maxPatients: 15 },
    { _id: "4", day: "Thursday", startTime: "15:00", endTime: "19:30", maxPatients: 8 },
    { _id: "5", day: "Friday", startTime: "10:00", endTime: "15:00", maxPatients: 16 },
    { _id: "6", day: "Sunday", startTime: "09:00", endTime: "12:00", maxPatients: 6 }
];

export default function ManageSchedulePage() {
    const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);

    // SweetAlert2 দিয়ে Add এবং Edit করার জন্য কমন Popup Handler
    const openSchedulePopup = (schedule = null) => {
        const isEditMode = !!schedule;

        // ডপডাউন অপশনগুলো তৈরি করা
        const dayOptions = DAYS_OF_WEEK.map(day =>
            `<option value="${day}" ${schedule?.day === day ? 'selected' : ''}>${day}</option>`
        ).join('');

        Swal.fire({
            title: isEditMode ? 'Modify Availability Slot' : 'Create New Availability Slot',
            html: `
        <div style="text-align: left; font-family: sans-serif;">
          <div style="margin-bottom: 15px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Select Day</label>
            <select id="swal-day" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;">
              <option value="" disabled ${!schedule ? 'selected' : ''}>Choose active work day</option>
              ${dayOptions}
            </select>
          </div>
          
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Start Time</label>
              <input type="time" id="swal-startTime" value="${schedule?.startTime || ''}" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">End Time</label>
              <input type="time" id="swal-endTime" value="${schedule?.endTime || ''}" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
            </div>
          </div>

          <div>
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Max Target Patients</label>
            <input type="number" id="swal-maxPatients" min="1" value="${schedule?.maxPatients || 10}" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
          </div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#ef4444',
            confirmButtonText: isEditMode ? 'Save Modifications' : 'Create Entry',
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
        }).then((result) => {
            if (result.isConfirmed) {
                const data = result.value;

                if (isEditMode) {
                    // ফেক ডাটা আপডেট (State Update)
                    setSchedules(prev => prev.map(item =>
                        item._id === schedule._id ? { ...data, _id: schedule._id } : item
                    ));
                    Swal.fire({ icon: 'success', title: 'Schedule updated successfully!', timer: 1500, showConfirmButton: false });
                } else {
                    // নতুন ফেক ডাটা যোগ (State Add)
                    const newSchedule = { ...data, _id: Date.now().toString() };
                    setSchedules(prev => [...prev, newSchedule]);
                    Swal.fire({ icon: 'success', title: 'Schedule added successfully!', timer: 1500, showConfirmButton: false });
                }
            }
        });
    };

    // Delete Handler (English Version)
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this time slot!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setSchedules(prev => prev.filter(item => item._id !== id));
                Swal.fire('Deleted!', 'The slot has been removed successfully.', 'success');
            }
        });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                        <FaCalendarAlt className="text-teal-600" /> Manage Available Schedules
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1">Configure appointment availability configurations</p>
                </div>
                <Button
                    onPress={() => openSchedulePopup(null)}
                    color="primary"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/10"
                    startContent={<FaPlus />}
                >
                    Add Schedule
                </Button>
            </div>

            {/* Table section */}
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
                            {schedules.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-sm text-slate-400">
                                        No active scheduling availability found.
                                    </td>
                                </tr>
                            ) : (
                                schedules.map((item) => (
                                    <tr key={item._id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 text-sm">
                                        <td className="p-4 pl-6 font-semibold text-slate-700 dark:text-slate-200">{item.day}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 font-medium text-xs border border-teal-100/50 dark:border-teal-900/30">
                                                <FaClock className="text-[10px]" /> {item.startTime} - {item.endTime}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-slate-500">{item.maxPatients} Patients</td>
                                        <td className="p-4 text-center pr-6">
                                            <div className="flex justify-center items-center gap-2">
                                                {/* Edit বাটনে ক্লিক করলে এখন SweetAlert2 Popup আসবে */}
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="flat"
                                                    className="text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/30 rounded-lg"
                                                    onPress={() => openSchedulePopup(item)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="flat"
                                                    className="text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100/50 dark:border-red-900/30 rounded-lg"
                                                    onPress={() => handleDelete(item._id)}
                                                >
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