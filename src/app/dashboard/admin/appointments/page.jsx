'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner } from '@heroui/react';
import { FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function OverseeAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('access-token');

            const res = await axios.get(
                'http://localhost:5000/appointments',
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            setAppointments(res.data || []);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: 'Failed to load appointments.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-slate-900">

            {/* Header */}
            <div className="flex items-center gap-3 border-b pb-4 mb-5">
                <FaCalendarCheck className="text-2xl text-primary" />
                <h2 className="text-xl font-bold">
                    All Appointments
                </h2>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-52">
                    <Spinner size="lg" color="primary" />
                </div>
            ) : (
                <div className="overflow-x-auto">

                    <table className="table w-full">

                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800">
                                <th>#</th>
                                <th>Patient ID</th>
                                <th>Doctor ID</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Symptoms</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No appointments found.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((appointment, index) => (
                                    <tr
                                        key={appointment._id}
                                        className="hover"
                                    >
                                        <td>{index + 1}</td>

                                        <td>
                                            {appointment.patientId}
                                        </td>

                                        <td>
                                            {appointment.doctorId}
                                        </td>

                                        <td>
                                            {appointment.appointmentDate}
                                        </td>

                                        <td>
                                            {appointment.appointmentTime}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${appointment.appointmentStatus ===
                                                        'accepted'
                                                        ? 'badge-success'
                                                        : appointment.appointmentStatus ===
                                                            'pending'
                                                            ? 'badge-warning'
                                                            : appointment.appointmentStatus ===
                                                                'rejected'
                                                                ? 'badge-error'
                                                                : 'badge-neutral'
                                                    }`}
                                            >
                                                {appointment.appointmentStatus}
                                            </span>
                                        </td>

                                        <td>
                                            {appointment.symptoms
                                                ? appointment.symptoms
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>

                </div>
            )}
        </Card>
    );
}