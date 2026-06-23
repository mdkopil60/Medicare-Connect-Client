'use client';

import { useState } from 'react';
import { Card } from '@heroui/react';
import { FaUsers, FaUserMd, FaCalendarCheck, FaStar, FaChartLine } from 'react-icons/fa';

const INITIAL_ANALYTICS = {
    totalPatients: 1240,
    totalDoctors: 48,
    totalAppointments: 3120,
    doctorPerformance: [
        { name: "Dr. Michael Vance", rating: 4.9, specialty: "Cardiologist" },
        { name: "Dr. Sarah Smith", rating: 4.7, specialty: "Pediatrician" },
        { name: "Dr. Emily Davis", rating: 4.5, specialty: "Dermatologist" }
    ]
};

export default function AdminDashboardOverview() {
    const [analytics] = useState(INITIAL_ANALYTICS);

    return (
        <>
            <div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FaChartLine className="text-teal-600" /> Dashboard Overview
                </h1>
                <p className="text-xs text-slate-400 mt-1">Real-time system statistics and performance metrics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 rounded-2xl shadow-sm">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><FaUsers className="text-2xl" /></div>
                    <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Total Patients</span>
                        <p className="text-2xl font-black font-mono text-slate-800 dark:text-white">{analytics.totalPatients}</p>
                    </div>
                </Card>

                <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 rounded-2xl shadow-sm">
                    <div className="p-4 bg-teal-50 text-teal-600 rounded-xl"><FaUserMd className="text-2xl" /></div>
                    <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Total Doctors</span>
                        <p className="text-2xl font-black font-mono text-slate-800 dark:text-white">{analytics.totalDoctors}</p>
                    </div>
                </Card>

                <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 rounded-2xl shadow-sm">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><FaCalendarCheck className="text-2xl" /></div>
                    <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Total Appointments</span>
                        <p className="text-2xl font-black font-mono text-slate-800 dark:text-white">{analytics.totalAppointments}</p>
                    </div>
                </Card>
            </div>

            <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <FaStar className="text-amber-500" /> Top Performing Physicians
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analytics.doctorPerformance.map((doc, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{doc.name}</p>
                                <p className="text-xs text-slate-400">{doc.specialty}</p>
                            </div>
                            <span className="flex items-center gap-1 font-bold text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded-lg">
                                <FaStar /> {doc.rating}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </>
    );
}