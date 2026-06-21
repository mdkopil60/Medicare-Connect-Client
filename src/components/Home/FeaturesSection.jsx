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

// Added specific color themes for each feature to make it vibrant and distinct
const features = [
    {
        icon: FaUserMd,
        title: 'Expert Doctors',
        description: 'Access to verified and experienced healthcare professionals across multiple specializations.',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'hover:border-blue-500/30'
    },
    {
        icon: FaCalendarCheck,
        title: 'Easy Booking',
        description: 'Book appointments in seconds with our streamlined scheduling system.',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        borderColor: 'hover:border-emerald-500/30'
    },
    {
        icon: FaCreditCard,
        title: 'Secure Payments',
        description: 'Pay consultation fees securely through Stripe payment gateway.',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        borderColor: 'hover:border-purple-500/30'
    },
    {
        icon: FaStar,
        title: 'Ratings & Reviews',
        description: 'Read patient reviews and rate your doctors after visits.',
        color: 'text-amber-500',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        borderColor: 'hover:border-amber-500/30'
    },
    {
        icon: FaClock,
        title: 'Real-time Availability',
        description: 'Check doctor availability and book slots that work for you.',
        color: 'text-pink-500',
        bgColor: 'bg-pink-50 dark:bg-pink-950/30',
        borderColor: 'hover:border-pink-500/30'
    },
    {
        icon: FaShieldAlt,
        title: 'Data Privacy',
        description: 'Your medical records are encrypted and protected at all times.',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
        borderColor: 'hover:border-cyan-500/30'
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-20 bg-gradient-to-b from-default-50 to-default-100 dark:from-background dark:to-default-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative">

                {/* Visual Accent Blobs for Depth */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/20 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-200/20 blur-3xl rounded-full pointer-events-none" />

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 relative z-10"
                >
                    <span className="text-xs font-bold tracking-wider uppercase bg-primary-50 text-primary-600 px-3 py-1 rounded-full dark:bg-primary-950/50">
                        Features
                    </span>
                    <h2 className="text-4xl text-black md:text-5xl font-black tracking-tight mt-4 bg-gradient-to-r from-default-900 via-primary-600 to-secondary-500 bg-clip-text text-transparent">
                        Why Choose MediCare Connect?
                    </h2>
                    <p className="text-default-500 text-lg mt-4 max-w-2xl mx-auto balance">
                        Everything you need for seamless, modern healthcare management at your fingertips.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -8 }}
                                viewport={{ once: true }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.05 }}
                            >
                                <Card className={`p-8 h-full border border-transparent transition-all duration-300 ${feature.borderColor} bg-background/60 backdrop-blur-md shadow-sm hover:shadow-2xl hover:shadow-default-200/50 dark:hover:shadow-none`}>
                                    <div className="flex flex-col items-start text-left h-full">

                                        {/* Colorful Icon Container */}
                                        <div className={`p-4 rounded-2xl mb-6 ${feature.bgColor} ${feature.color} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                                            <Icon size={28} />
                                        </div>

                                        <h3 className="text-xl font-bold mb-3 text-default-800">
                                            {feature.title}
                                        </h3>

                                        <p className="text-default-500 text-medium leading-relaxed mt-auto">
                                            {feature.description}
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}