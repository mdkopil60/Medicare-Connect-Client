'use client';

import { motion } from 'framer-motion';
import {
    FaUserMd,
    FaCalendarCheck,
    FaCreditCard,
    FaStar,
    FaClock,
    FaShieldAlt,
} from 'react-icons/fa';
import { Card } from '@heroui/react';

const features = [
    {
        icon: FaUserMd,
        title: 'Expert Doctors',
        description: 'Access to verified and experienced healthcare professionals across multiple specializations.',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-950/40',
        borderColor: 'hover:border-blue-500/40',
    },
    {
        icon: FaCalendarCheck,
        title: 'Easy Booking',
        description: 'Book appointments in seconds with our streamlined scheduling system.',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-100 dark:bg-emerald-950/40',
        borderColor: 'hover:border-emerald-500/40',
    },
    {
        icon: FaCreditCard,
        title: 'Secure Payments',
        description: 'Pay consultation fees securely through Stripe payment gateway.',
        color: 'text-purple-500',
        bgColor: 'bg-purple-100 dark:bg-purple-950/40',
        borderColor: 'hover:border-purple-500/40',
    },
    {
        icon: FaStar,
        title: 'Ratings & Reviews',
        description: 'Read patient reviews and rate your doctors after visits.',
        color: 'text-amber-500',
        bgColor: 'bg-amber-100 dark:bg-amber-950/40',
        borderColor: 'hover:border-amber-500/40',
    },
    {
        icon: FaClock,
        title: 'Real-time Availability',
        description: 'Check doctor availability and book slots that work for you.',
        color: 'text-pink-500',
        bgColor: 'bg-pink-100 dark:bg-pink-950/40',
        borderColor: 'hover:border-pink-500/40',
    },
    {
        icon: FaShieldAlt,
        title: 'Data Privacy',
        description: 'Your medical records are encrypted and protected at all times.',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-100 dark:bg-cyan-950/40',
        borderColor: 'hover:border-cyan-500/40',
    },
];

export default function FeaturesSection() {
    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-zinc-950 dark:to-black">
            {/* Background Effects */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold tracking-wider uppercase text-sm">
                        Features
                    </span>
                    <h2 className="mt-6 text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Why Choose MediCare Connect?
                    </h2>
                    <p className="max-w-2xl mx-auto mt-6 text-lg text-default-500 leading-relaxed">
                        Experience modern healthcare with seamless appointments, secure payments, trusted doctors, and complete privacy.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                                <Card
                                    className={`group relative overflow-hidden p-8 h-full bg-background/70 backdrop-blur-xl border border-default-200/50 transition-all duration-500 ${feature.borderColor} hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]`}
                                >
                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-1000" />
                                    </div>

                                    <div className="relative z-10">
                                        <motion.div
                                            whileHover={{ rotate: 8, scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            className={`relative inline-flex p-5 rounded-3xl mb-6 ${feature.bgColor} ${feature.color} shadow-lg`}
                                        >
                                            <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl" />
                                            <Icon size={32} />
                                        </motion.div>

                                        <h3 className="text-2xl font-bold mb-4 text-default-800 dark:text-white group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-default-500 leading-relaxed text-base">
                                            {feature.description}
                                        </p>
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}