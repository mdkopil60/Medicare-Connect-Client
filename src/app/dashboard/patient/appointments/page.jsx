"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Chip, Input } from "@heroui/react";
import { Calendar, Clock, XCircle, Edit2, User, X } from "lucide-react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
// ✅ Better Auth

export default function AppointmentsPage() {
    const { data: session, isPending: sessionLoading } = authClient.useSession(); // ✅ Better Auth session
    const user = session?.user;

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");

    // ১. Better Auth session থেকে real user email দিয়ে appointments fetch করা
    useEffect(() => {
        if (user?.email) {
            fetchAppointments(user.email);
        }
    }, [user?.email]);

    const fetchAppointments = async (email) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access-token");
            const response = await axios.get(
                `http://localhost:5000/patient/appointments/${email}`, // ✅ real email
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    // ২. Reschedule Modal খোলা
    const handleRescheduleClick = (appt) => {
        setSelectedAppt(appt);
        setNewDate(appt.appointmentDate);
        setNewTime(appt.appointmentTime);
        setIsModalOpen(true);
    };

    // ৩. Reschedule Save করা
    const saveReschedule = async () => {
        try {
            const token = localStorage.getItem("access-token");
            const response = await axios.patch(
                `http://localhost:5000/appointments/reschedule/${selectedAppt._id}`,
                {
                    appointmentDate: newDate,
                    appointmentTime: newTime,
                },
                {
                    headers: { authorization: `Bearer ${token}` },
                }
            );

            if (response.data.modifiedCount > 0) {
                fetchAppointments(user.email);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error rescheduling:", error);
        }
    };

    // ৪. Appointment Cancel করা
    const handleCancel = async (id) => {
        if (confirm("Are you sure you want to cancel this appointment?")) {
            try {
                const token = localStorage.getItem("access-token");
                const response = await axios.patch(
                    `http://localhost:5000/appointments/cancel/${id}`,
                    {},
                    {
                        headers: { authorization: `Bearer ${token}` },
                    }
                );

                if (response.data.modifiedCount > 0) {
                    fetchAppointments(user.email);
                }
            } catch (error) {
                console.error("Error cancelling appointment:", error);
            }
        }
    };

    // Session লোড হচ্ছে অথবা Appointments লোড হচ্ছে
    if (sessionLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // User logged in না থাকলে
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-default-500 text-lg font-semibold">
                    Please log in to view your appointments.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl p-6 min-h-screen bg-slate-50/40 dark:bg-zinc-950">
            {/* Header */}
            <div className="mb-10 border-b border-default-200/60 pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    My Appointments
                </h1>
                <p className="text-default-500 text-sm mt-1">
                    Manage, track, and update your medical schedules seamlessly.
                </p>
            </div>

            {appointments.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-danger-200 bg-danger-50/10">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <XCircle className="w-12 h-12 text-danger-400" />
                        <p className="text-lg font-semibold text-default-700">
                            No appointments active.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map((appt) => {
                        const isConfirmed =
                            appt.appointmentStatus === "confirmed" ||
                            appt.appointmentStatus === "Confirmed";
                        const isCancelled = appt.appointmentStatus === "cancelled";

                        return (
                            <Card
                                key={appt._id}
                                className={`group relative border transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl
                                    ${isConfirmed
                                        ? "border-emerald-100 dark:border-emerald-950 hover:border-emerald-400/50 bg-gradient-to-b from-emerald-50/20 via-background to-background"
                                        : "border-amber-100 dark:border-amber-950 hover:border-amber-400/50 bg-gradient-to-b from-amber-50/20 via-background to-background"
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start gap-3 mb-5">
                                        <div className="flex items-center gap-3.5">
                                            <div
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border transition-transform group-hover:scale-105 duration-300
                                                ${isConfirmed
                                                        ? "bg-emerald-100/70 text-emerald-600 border-emerald-200/50"
                                                        : "bg-amber-100/70 text-amber-600 border-amber-200/50"
                                                    }`}
                                            >
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold tracking-tight text-default-800 leading-snug">
                                                    {appt.doctorName || "Specialist Doctor"}
                                                </h3>
                                                <p
                                                    className={`text-xs font-semibold uppercase tracking-wider mt-0.5 
                                                    ${isConfirmed ? "text-emerald-600" : "text-amber-600"}`}
                                                >
                                                    {appt.specialty || appt.specialization || "General Physician"}
                                                </p>
                                            </div>
                                        </div>

                                        <Chip
                                            variant="flat"
                                            color={
                                                isConfirmed
                                                    ? "success"
                                                    : isCancelled
                                                        ? "danger"
                                                        : "warning"
                                            }
                                            size="sm"
                                            className="font-bold px-2 rounded-full capitalize"
                                        >
                                            {appt.appointmentStatus}
                                        </Chip>
                                    </div>

                                    <div
                                        className={`p-4 rounded-2xl border flex flex-col gap-3
                                        ${isConfirmed
                                                ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100/40"
                                                : "bg-amber-50/40 dark:bg-amber-950/20 border-amber-100/40"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 text-sm font-medium text-default-700">
                                            <Calendar
                                                className={`w-4 h-4 ${isConfirmed ? "text-emerald-500" : "text-amber-500"}`}
                                            />
                                            <span>{appt.appointmentDate}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-medium text-default-700">
                                            <Clock
                                                className={`w-4 h-4 ${isConfirmed ? "text-emerald-500" : "text-amber-500"}`}
                                            />
                                            <span>{appt.appointmentTime}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                                    <Button
                                        className="flex-1 font-bold text-xs h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        variant="flat"
                                        isDisabled={isCancelled}
                                        startContent={<Edit2 className="w-3.5 h-3.5" />}
                                        onPress={() => handleRescheduleClick(appt)}
                                    >
                                        Reschedule
                                    </Button>
                                    <Button
                                        className="font-bold text-xs h-11 rounded-xl border border-danger-100 dark:border-danger-950/50 hover:bg-danger/10 text-danger"
                                        variant="light"
                                        isDisabled={isCancelled}
                                        startContent={<XCircle className="w-3.5 h-3.5" />}
                                        onPress={() => handleCancel(appt._id)}
                                    >
                                        {isCancelled ? "Cancelled" : "Cancel"}
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Reschedule Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative bg-white dark:bg-zinc-900 max-w-md w-full p-6 rounded-[28px] shadow-2xl border border-default-100 flex flex-col gap-5 z-10 animate-in zoom-in-95 duration-200">
                        <button
                            type="button"
                            className="absolute right-4 top-4 text-default-400 hover:text-default-600 p-1.5 rounded-xl hover:bg-default-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="pb-1">
                            <h2 className="text-xl font-bold text-default-800 dark:text-zinc-100 tracking-tight">
                                Reschedule Appointment
                            </h2>
                            <p className="text-sm text-default-500 mt-1">
                                Rescheduling your session with{" "}
                                <span className="text-indigo-600 font-bold">
                                    {selectedAppt?.doctorName}
                                </span>
                                .
                            </p>
                        </div>

                        <div className="flex flex-col gap-5 py-1">
                            <Input
                                type="date"
                                label="Select New Date"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="xl"
                                size="lg"
                                className="font-medium"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                            <Input
                                type="time"
                                label="Select New Time"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="xl"
                                size="lg"
                                className="font-medium"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl text-sm font-bold text-danger bg-transparent hover:bg-danger/10 transition-colors"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Dismiss
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity"
                                onClick={saveReschedule}
                            >
                                Apply New Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}