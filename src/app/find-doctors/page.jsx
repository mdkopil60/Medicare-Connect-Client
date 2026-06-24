"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Spinner } from "@heroui/react";
import { User, MapPin, DollarSign } from "lucide-react";
import axios from "axios";

export default function FindDoctorsPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:5000/doctors?limit=20")
            .then((res) => {
                // ব্যাকএন্ড অ্যারে ফরম্যাট অনুযায়ী ডেটা সেট করা
                setDoctors(res.data?.doctors || res.data || []);
            })
            .catch((err) => console.error("Error fetching doctors:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" label="Loading Expert Doctors..." />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl p-6 min-h-screen">
            <h1 className="text-3xl font-extrabold text-default-800 mb-2">Find Our Expert Doctors</h1>
            <p className="text-default-500 mb-8">Book an appointment with top-rated and verified specialists.</p>

            {doctors.length === 0 ? (
                <p className="text-center text-default-400 py-10">No verified doctors found at this moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <Card key={doctor._id} className="p-5 border border-default-100 flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <div className="w-20 h-20 bg-emerald-100 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                                    {doctor.profileImage ? (
                                        <img src={doctor.profileImage} alt={doctor.doctorName} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-emerald-600" />
                                    )}
                                </div>
                                <div className="inline-block bg-emerald-50 text-emerald-600 font-bold uppercase text-[10px] px-2 py-0.5 rounded mb-2">
                                    {doctor.specialization}
                                </div>
                                <h3 className="text-lg font-bold text-default-800 dark:text-white">{doctor.doctorName}</h3>
                                <p className="text-xs text-default-400 mt-0.5">{doctor.qualifications || "MBBS, MD"}</p>

                                <div className="mt-4 flex flex-col gap-1.5 text-sm text-default-600 dark:text-zinc-300">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-default-400" />
                                        <span>{doctor.hospitalName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-emerald-500" />
                                        <span className="font-semibold text-emerald-600">${doctor.consultationFee}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 🔗 এখানে ক্লিক করলে আইডি সহ ডায়নামিক রাউটে নিয়ে যাবে */}
                            <Button
                                color="primary"
                                className="w-full mt-5 font-semibold rounded-xl bg-blue-600 text-white"
                                onPress={() => router.push(`/find-doctors/${doctor._id}`)}
                            >
                                View Profile & Book
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}