'use client';

import { motion } from 'framer-motion';
import { FaUserMd, FaHeartbeat, FaShieldAlt, FaAward } from 'react-icons/fa';

const stats = [
    { icon: FaUserMd, value: '500+', label: 'Expert Doctors' },
    { icon: FaHeartbeat, value: '10K+', label: 'Happy Patients' },
    { icon: FaShieldAlt, value: '100%', label: 'Data Security' },
    { icon: FaAward, value: '15+', label: 'Years Experience' },
];

export default function AboutUsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">About MediCare Connect</h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    We are dedicated to revolutionizing healthcare access by connecting patients with trusted medical professionals through a seamless digital platform.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Mission</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        MediCare Connect was founded with a simple yet powerful vision: to make quality healthcare accessible to everyone. We believe that finding the right doctor should be simple, booking an appointment should be effortless, and managing health records should be secure and convenient.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Our platform bridges the gap between patients and healthcare providers, offering a comprehensive suite of tools for appointment management, digital prescriptions, secure payments, and real-time communication.
                    </p>
                </div>
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
                    <div className="text-6xl mb-4">&#x1FA7A;</div>
                    <h3 className="text-2xl font-bold mb-2">Quality Healthcare</h3>
                    <p className="text-teal-100">At your fingertips, anytime, anywhere.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 text-center"
                    >
                        <stat.icon className="text-3xl text-teal-600 mx-auto mb-3" />
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
