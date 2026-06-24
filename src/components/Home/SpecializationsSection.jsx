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
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-zinc-950 dark:to-black">

            {/* Background Effects */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm">
                        Medical Categories
                    </span>

                    <h2 className="mt-6 text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Medical Specializations
                    </h2>

                    <p className="max-w-2xl mx-auto mt-5 text-lg text-default-500">
                        Find experienced and verified healthcare specialists
                        tailored to your unique medical needs.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {SPECIALIZATIONS.map((spec, index) => {
                        const config = specConfig[spec];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={spec}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.03,
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.05,
                                }}
                            >
                                <Link
                                    href={`/ find - doctors ? specialty = ${spec.toLowerCase()} `}
                                >
                                    <Card
                                        className="
                      group
                      relative
                      overflow-hidden
                      h-full
                      p-6
                      bg-background/70
                      backdrop-blur-xl
                      border
                      border-default-200/50
                      hover:border-primary/30
                      transition-all
                      duration-500
                      hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
                    "
                                    >
                                        {/* Glow */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5" />

                                        <div className="relative z-10 flex flex-col items-center text-center">

                                            <motion.div
                                                whileHover={{
                                                    rotate: 8,
                                                    scale: 1.1,
                                                }}
                                                className={`
p - 5
rounded - 3xl
mb - 5
                          ${config.bg}
                          ${config.color}
shadow - lg
    `}
                                            >
                                                <Icon size={32} />
                                            </motion.div>

                                            <h3 className="font-bold text-lg text-default-800 dark:text-white group-hover:text-primary transition-colors">
                                                {spec}
                                            </h3>

                                            <p className="text-xs text-default-400 mt-2 opacity-0 group-hover:opacity-100 transition duration-300">
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
                    className="text-center mt-16"
                >
                    <Link
                        href="/find-doctors"
                        className="
              inline-flex
              items-center
              gap-3
              px-8
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              via-purple-600
              to-pink-500
              text-white
              font-semibold
              shadow-xl
              hover:scale-105
              transition-all
              duration-300
            "
                    >
                        Explore All Specializations
                        <FaArrowRight />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}

