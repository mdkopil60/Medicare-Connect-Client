'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { Card } from '@heroui/react';
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
    FaEyeDropper
} from 'react-icons/fa';

// Expanded icon mapping with rich, vibrant color configurations for each field
const specConfig = {
    Cardiology: { icon: FaHeartbeat, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30' },
    Neurology: { icon: FaBrain, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30' },
    Orthopedics: { icon: FaBone, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    Pediatrics: { icon: FaBaby, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/30' },
    Dermatology: { icon: FaEye, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/30' },
    Oncology: { icon: FaRibbon, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    Gastroenterology: { icon: FaProcedures, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    Pulmonology: { icon: FaLungs, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30' },
    Urology: { icon: FaStethoscope, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    Ophthalmology: { icon: FaEyeDropper, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30' },
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
        <section className="py-20 bg-default-50 dark:bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-bold tracking-wider uppercase bg-secondary-50 text-secondary-600 px-3 py-1 rounded-full dark:bg-secondary-950/50">
                        Categories
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black mt-4 bg-gradient-to-r from-default-900 via-secondary-600 to-primary-500 bg-clip-text text-transparent">
                        Medical Specializations
                    </h2>
                    <p className="text-default-500 mt-3 text-lg max-w-xl mx-auto">
                        Find the right verified specialist tailored precisely to your health needs
                    </p>
                </motion.div>

                {/* Categories Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {SPECIALIZATIONS.map((spec, index) => {
                        const config = specConfig[spec] || { icon: FaStethoscope, color: 'text-primary', bg: 'bg-primary-50' };
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={spec}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -6 }}
                                viewport={{ once: true }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: index * 0.04 }}
                                className="h-full"
                            >
                                <Link href={`/find-doctors?specialty=${spec.toLowerCase()}`} className="block h-full">
                                    <Card className="p-6 h-full border border-default-200/40 bg-background/70 backdrop-blur-md flex flex-col items-center justify-center text-center hover:shadow-xl hover:border-primary-500/20 group cursor-pointer transition-all duration-300">

                                        {/* Dynamic Colorful Icon Wrapper */}
                                        <div className={`p-4 rounded-2xl mb-4 ${config.bg} ${config.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                            <Icon size={28} />
                                        </div>

                                        <h3 className="font-bold text-default-800 text-base tracking-tight transition-colors group-hover:text-primary">
                                            {spec}
                                        </h3>

                                        <span className="text-xs text-default-400 mt-1 opacity-0 group-hover:opacity-105 transition-opacity duration-300">
                                            View Doctors →
                                        </span>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Action Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/find-doctors"
                        className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-full text-primary border-2 border-primary/30 hover:border-primary bg-transparent hover:bg-primary/5 transition-all duration-200 shadow-sm"
                    >
                        View All Specializations
                        <FaArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}