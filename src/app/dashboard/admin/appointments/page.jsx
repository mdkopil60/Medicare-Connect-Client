'use client';

import { useState } from 'react';
import { Card } from '@heroui/react';
import { FaCalendarCheck } from 'react-icons/fa';

const INITIAL_APPOINTMENTS = [
    { _id: "apt-901", patientName: "Alice Green", doctorName: "Dr. Clara Oswald", date: "2026-06-25", status: "Accepted" },
    { _id: "apt-902", patientName: "Bob Ross", doctorName: "Dr. Michael Vance", date: "2026-06-26", status: "Pending" }
];

export default function OverseeAppointmentsPage() {
    const [appointments] = useState(INITIAL_APPOINTMENTS);

    return (
        <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <FaCalendarCheck className="text-teal-600 text-lg" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">Live Central Appointment Monitor</h3>
            </div>
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold text-xs uppercase">
                            <th className="p-3 pl-4">Patient Target</th>
                            <th className="p-3">Assigned Physician</th>
                            <th className="p-3">Schedule Date</th>
                            <th className="p-3 text-right pr-4">Status Tracking</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(apt => (
                            <tr key={apt._id} className="border-b border-slate-100 dark:border-slate-800/40 last:border-0 text-slate-700 dark:text-slate-300">
                                <td className="p-3 pl-4 font-semibold">{apt.patientName}</td>
                                <td className="p-3 text-slate-500 font-medium">{apt.doctorName}</td>
                                <td className="p-3 font-mono text-xs text-slate-400">{apt.date}</td>
                                <td className="p-3 text-right pr-4">
                                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${apt.status === 'Accepted' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>{apt.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}