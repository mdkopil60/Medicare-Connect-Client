'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@heroui/react';
import { FaArrowRight } from 'react-icons/fa';

import {
    FaStethoscope,
    FaHeartbeat,
    FaBrain,
    FaBone,
    FaBaby,
    FaEye,
    FaRibbon,
    FaLungs,
    FaProcedures,
    FaEyeDropper,
} from 'react-icons/fa';

const specConfig = {
    Cardiology: {
        icon: FaHeartbeat,
        color: 'text-rose-500',
        bg: 'bg-rose-100 dark:bg-rose-950/40',
    },
    Neurology: {
        icon: FaBrain,
        color: 'text-violet-500',
        bg: 'bg-violet-100 dark:bg-violet-950/40',
    },
    Orthopedics: {
        icon: FaBone,
        color: 'text-amber-500',
        bg: 'bg-amber-100 dark:bg-amber-950/40',
    },
    Pediatrics: {
        icon: FaBaby,
        color: 'text-sky-500',
        bg: 'bg-sky-100 dark:bg-sky-950/40',
    },
    Dermatology: {
        icon: FaEye,
        color: 'text-teal-500',
        bg: 'bg-teal-100 dark:bg-teal-950/40',
    },
    Oncology: {
        icon: FaRibbon,
        color: 'text-indigo-500',
        bg: 'bg-indigo-100 dark:bg-indigo-950/40',
    },
    Gastroenterology: {
        icon: FaProcedures,
        color: 'text-emerald-500',
        bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    },
    Pulmonology: {
        icon: FaLungs,
        color: 'text-cyan-500',
        bg: 'bg-cyan-100 dark:bg-cyan-950/40',
    },
    Urology: {
        icon: FaStethoscope,
        color: 'text-blue-500',
        bg: 'bg-blue-100 dark:bg-blue-950/40',
    },
    Ophthalmology: {
        icon: FaEyeDropper,
        color: 'text-pink-500',
        bg: 'bg-pink-100 dark:bg-pink-950/40',
    },
};

export const SPECIALIZATIONS = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Oncology',
    'Gastroenterology',
    'Pulmonology',
    'Urology',
    'Ophthalmology',
];

export default function SpecializationsSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 dark:from-black dark:via-zinc-950 dark:to-black">
            {/* Background */}
            <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-primary">
                        Medical Categories
                    </span>

                    <h2 className="mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-4xl font-black text-transparent md:text-6xl">
                        Medical Specializations
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg text-default-500">
                        Find experienced and verified healthcare specialists
                        tailored to your unique medical needs.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                    {SPECIALIZATIONS.map((spec, index) => {
                        const config = specConfig[spec] || {
                            icon: FaStethoscope,
                            color: 'text-primary',
                            bg: 'bg-primary/10',
                        };

                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={spec}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -10, scale: 1.03 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/find-doctors?specialty=${spec.toLowerCase()}`}
                                >
                                    <Card className="group relative h-full overflow-hidden border border-default-200/50 bg-background/70 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <motion.div
                                                whileHover={{
                                                    rotate: 8,
                                                    scale: 1.1,
                                                }}
                                                className={`mb-5 rounded-3xl p-5 shadow-lg ${config.bg} ${config.color}`}
                                            >
                                                <Icon size={32} />
                                            </motion.div>

                                            <h3 className="text-lg font-bold text-default-800 transition-colors group-hover:text-primary dark:text-white">
                                                {spec}
                                            </h3>

                                            <p className="mt-2 text-xs text-default-400 opacity-0 transition duration-300 group-hover:opacity-100">
                                                View Specialists →
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <Link
                        href="/find-doctors"
                        className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        Explore All Specializations
                        <FaArrowRight />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}