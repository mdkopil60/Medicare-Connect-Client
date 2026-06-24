'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';

import {
    Card,
    Button,
    Spinner,
} from '@heroui/react';

import {
    User,
    Briefcase,
    DollarSign,
} from 'lucide-react';

export default function FeaturedDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('http://localhost:5000/doctors?limit=3')
            .then((res) => {
                setDoctors(res.data?.doctors || res.data || []);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Spinner
                    size="lg"
                    label="Loading Expert Doctors..."
                />
            </div>
        );
    }

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-zinc-950 dark:to-black">

            {/* Background Blur Effects */}
            <div className="absolute top-10 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">
                        Featured Doctors
                    </span>

                    <h2 className="mt-5 text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Meet Our Expert Specialists
                    </h2>

                    <p className="text-default-500 mt-5 max-w-2xl mx-auto text-lg">
                        Connect with trusted healthcare professionals and receive
                        world-class medical consultation from verified experts.
                    </p>
                </motion.div>

                {/* Doctors Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {doctors.map((doctor, index) => (
                        <motion.div
                            key={doctor._id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                            }}
                        >
                            <Card
                                className="
                  group
                  relative
                  overflow-hidden
                  bg-background/70
                  backdrop-blur-xl
                  border
                  border-default-200/50
                  hover:border-primary/30
                  transition-all
                  duration-500
                  hover:-translate-y-3
                  hover:shadow-[0_25px_60px_rgba(59,130,246,0.15)]
                  rounded-3xl
                  p-6
                "
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />

                                <div className="relative z-10">

                                    {/* Doctor Image */}
                                    <div className="flex justify-center mb-5">
                                        <div className="relative">

                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-lg opacity-50" />

                                            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl">
                                                {doctor.profileImage ? (
                                                    <img
                                                        src={doctor.profileImage}
                                                        alt={doctor.doctorName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                        <User
                                                            size={40}
                                                            className="text-primary"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </div>

                                    {/* Specialization */}
                                    <div className="flex justify-center">
                                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-primary text-xs font-bold border border-primary/10">
                                            {doctor.specialization}
                                        </span>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-center text-2xl font-bold mt-4">
                                        {doctor.doctorName}
                                    </h3>

                                    {/* Qualification */}
                                    <p className="text-center text-default-500 text-sm mt-2">
                                        {doctor.qualifications || 'MBBS, Specialist'}
                                    </p>

                                    {/* Info Cards */}
                                    <div className="mt-6 space-y-3">

                                        <div className="flex items-center justify-between bg-default-100/60 dark:bg-zinc-900 rounded-xl p-3">
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} />
                                                <span className="text-sm">
                                                    Experience
                                                </span>
                                            </div>

                                            <span className="font-semibold text-primary">
                                                {doctor.experience || 0} Years
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between bg-default-100/60 dark:bg-zinc-900 rounded-xl p-3">
                                            <div className="flex items-center gap-2">
                                                <DollarSign size={16} />
                                                <span className="text-sm">
                                                    Consultation
                                                </span>
                                            </div>

                                            <span className="font-bold text-emerald-600">
                                                ${doctor.consultationFee}
                                            </span>
                                        </div>

                                    </div>

                                    {/* Button */}
                                    <Button
                                        as={Link}
                                        href={`/find-doctors/${doctor._id}`}
                                        className="
                      w-full
                      mt-6
                      rounded-2xl
                      font-semibold
                      text-white
                      bg-gradient-to-r
                      from-blue-600
                      via-purple-600
                      to-pink-500
                      shadow-lg
                    "
                                    >
                                        View Profile
                                    </Button>

                                </div>
                            </Card>
                        </motion.div>
                    ))}

                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-14"
                >
                    <Button
                        as={Link}
                        href="/find-doctors"
                        size="lg"
                        className="
              bg-gradient-to-r
              from-blue-600
              via-purple-600
              to-pink-500
              text-white
              font-semibold
              px-8
            "
                    >
                        View All Doctors
                    </Button>
                </motion.div>

            </div>
        </section>
    );
}