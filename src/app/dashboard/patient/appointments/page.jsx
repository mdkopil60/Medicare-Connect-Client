"use client";

import React, { useState } from "react";
// মোডালের সব ভাঙা সাব-কম্পোনেন্ট ইম্পোর্ট বাদ দেওয়া হয়েছে
import { Card, Button, Chip, Input } from "@heroui/react";
import { Calendar, Clock, XCircle, Edit2, User, X } from "lucide-react";

const initialAppointments = [
    {
        id: 1,
        doctor: "Dr. Nafis Iqbal",
        specialty: "Cardiologist",
        date: "2026-06-25",
        time: "10:30 AM",
        status: "Confirmed",
    },
    {
        id: 2,
        doctor: "Dr. Sarah Rahman",
        specialty: "Dermatologist",
        date: "2026-06-28",
        time: "03:15 PM",
        status: "Pending",
    },
    {
        id: 3,
        doctor: "Dr. Amit Hasan",
        specialty: "Pediatrician",
        date: "2026-07-02",
        time: "11:00 AM",
        status: "Confirmed",
    },
];

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");

    const handleRescheduleClick = (appt) => {
        setSelectedAppt(appt);
        setNewDate(appt.date);
        setNewTime(appt.time);
        setIsModalOpen(true);
    };

    const saveReschedule = () => {
        setAppointments((prev) =>
            prev.map((appt) =>
                appt.id === selectedAppt.id
                    ? { ...appt, date: newDate, time: newTime, status: "Pending" }
                    : appt
            )
        );
        setIsModalOpen(false);
    };

    const handleCancel = (id) => {
        if (confirm("Are you sure you want to cancel this appointment?")) {
            setAppointments((prev) => prev.filter((appt) => appt.id !== id));
        }
    };

    return (
        <div className="container mx-auto max-w-6xl p-6 min-h-screen bg-slate-50/40 dark:bg-zinc-950">
            {/* Colorful Header */}
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
                        <p className="text-lg font-semibold text-default-700">No appointments active.</p>
                    </div>
                </Card>
            ) : (
                /* COLORFUL GRID LAYOUT */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map((appt) => {
                        const isConfirmed = appt.status === "Confirmed";

                        return (
                            <Card
                                key={appt.id}
                                className={`group relative border transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl
                                    ${isConfirmed
                                        ? "border-emerald-100 dark:border-emerald-950 hover:border-emerald-400/50 bg-gradient-to-b from-emerald-50/20 via-background to-background"
                                        : "border-amber-100 dark:border-amber-950 hover:border-amber-400/50 bg-gradient-to-b from-amber-50/20 via-background to-background"
                                    }`}
                            >
                                {/* Main Content Area */}
                                <div className="p-6">
                                    {/* Top Header Block */}
                                    <div className="flex justify-between items-start gap-3 mb-5">
                                        <div className="flex items-center gap-3.5">
                                            {/* Colorful Avatar Badge */}
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border transition-transform group-hover:scale-105 duration-300
                                                ${isConfirmed
                                                    ? "bg-emerald-100/70 text-emerald-600 border-emerald-200/50"
                                                    : "bg-amber-100/70 text-amber-600 border-amber-200/50"
                                                }`}
                                            >
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold tracking-tight text-default-800 leading-snug">
                                                    {appt.doctor}
                                                </h3>
                                                <p className={`text-xs font-semibold uppercase tracking-wider mt-0.5 
                                                    ${isConfirmed ? "text-emerald-600" : "text-amber-600"}`}
                                                >
                                                    {appt.specialty}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Chip */}
                                        <Chip
                                            variant="flat"
                                            color={isConfirmed ? "success" : "warning"}
                                            size="sm"
                                            className="font-bold px-2 rounded-full"
                                        >
                                            {appt.status}
                                        </Chip>
                                    </div>

                                    {/* Informative Grid Center Piece */}
                                    <div className={`p-4 rounded-2xl border flex flex-col gap-3
                                        ${isConfirmed
                                            ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100/40"
                                            : "bg-amber-50/40 dark:bg-amber-950/20 border-amber-100/40"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 text-sm font-medium text-default-700">
                                            <Calendar className={`w-4 h-4 ${isConfirmed ? "text-emerald-500" : "text-amber-500"}`} />
                                            <span>{appt.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-medium text-default-700">
                                            <Clock className={`w-4 h-4 ${isConfirmed ? "text-emerald-500" : "text-amber-500"}`} />
                                            <span>{appt.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Styled Action Footer Buttons */}
                                <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                                    <Button
                                        className="flex-1 font-bold text-xs h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        variant="flat"
                                        startContent={<Edit2 className="w-3.5 h-3.5" />}
                                        onPress={() => handleRescheduleClick(appt)}
                                    >
                                        Reschedule
                                    </Button>
                                    <Button
                                        className="font-bold text-xs h-11 rounded-xl border border-danger-100 dark:border-danger-950/50 hover:bg-danger/10 text-danger"
                                        variant="light"
                                        startContent={<XCircle className="w-3.5 h-3.5" />}
                                        onPress={() => handleCancel(appt.id)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* ─── ১০০% ফিক্সড কাস্টম মোডাল (যা স্ক্রিন লক বা ব্লার করে আটকে থাকবে না) ─── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* ব্যাকড্রপ ব্লার লেয়ার */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* মোডাল কন্টেন্ট বক্স (পারফেক্ট সেন্টার লকড) */}
                    <div className="relative bg-white dark:bg-zinc-900 max-w-md w-full p-6 rounded-[28px] shadow-2xl border border-default-100 flex flex-col gap-5 z-10 animate-in zoom-in-95 duration-200">

                        {/* ক্লোজ বাটন */}
                        <button
                            type="button"
                            className="absolute right-4 top-4 text-default-400 hover:text-default-600 p-1.5 rounded-xl hover:bg-default-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* হেডার পার্ট */}
                        <div className="pb-1">
                            <h2 className="text-xl font-bold text-default-800 dark:text-zinc-100 tracking-tight">
                                Reschedule Appointment
                            </h2>
                            <p className="text-sm text-default-500 mt-1">
                                Rescheduling your session with <span className="text-indigo-600 font-bold">{selectedAppt?.doctor}</span>.
                            </p>
                        </div>

                        {/* বডি পার্ট (ইনপুট ফিল্ডস) */}
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

                        {/* ফুটার পার্ট (স্ট্যান্ডার্ড HTML বাটন) */}
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