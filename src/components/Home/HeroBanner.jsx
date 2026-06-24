'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FaUserMd,
    FaHeartbeat,
    FaHospital,
    FaPills,
} from 'react-icons/fa';

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 py-24 lg:py-32">
            {/* Background Effects */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/20 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-white font-medium">
                            🩺 Trusted Healthcare Platform
                        </span>

                        <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white">
                            Your Health,
                            <span className="block bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent">
                                Our Priority
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-gray-300 max-w-xl leading-relaxed">
                            Connect with experienced doctors, schedule appointments,
                            manage records, and receive quality healthcare services
                            anytime from anywhere.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link
                                href="/find-doctors"
                                className="px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Find Doctors
                            </Link>

                            <Link
                                href="/about"
                                className="px-8 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all duration-300"
                            >
                                Learn More
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-5 mt-12">
                            {[
                                { value: '500+', label: 'Doctors' },
                                { value: '10K+', label: 'Patients' },
                                { value: '50+', label: 'Hospitals' },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-5 text-center"
                                >
                                    <h3 className="text-3xl font-black text-white">
                                        {item.value}
                                    </h3>
                                    <p className="text-gray-300 text-sm mt-1">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:flex justify-center"
                    >
                        <div className="relative">

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                }}
                                className="absolute -top-10 -left-10 bg-white rounded-3xl p-6 shadow-2xl"
                            >
                                <FaUserMd className="text-5xl text-blue-600" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [10, -10, 10] }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                }}
                                className="absolute -bottom-10 -right-10 bg-white rounded-3xl p-6 shadow-2xl"
                            >
                                <FaHeartbeat className="text-5xl text-red-500" />
                            </motion.div>

                            {/* Main Glass Card */}
                            <div className="w-[450px] h-[450px] rounded-[40px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.4)] p-8">

                                <div className="grid grid-cols-2 gap-6 h-full">

                                    <div className="bg-white rounded-3xl flex flex-col items-center justify-center shadow-xl">
                                        <FaUserMd className="text-6xl text-blue-600 mb-3" />
                                        <h4 className="font-bold text-lg">
                                            Expert Doctors
                                        </h4>
                                    </div>

                                    <div className="bg-white rounded-3xl flex flex-col items-center justify-center shadow-xl">
                                        <FaHeartbeat className="text-6xl text-red-500 mb-3" />
                                        <h4 className="font-bold text-lg">
                                            24/7 Care
                                        </h4>
                                    </div>

                                    <div className="bg-white rounded-3xl flex flex-col items-center justify-center shadow-xl">
                                        <FaHospital className="text-6xl text-green-500 mb-3" />
                                        <h4 className="font-bold text-lg">
                                            Hospitals
                                        </h4>
                                    </div>

                                    <div className="bg-white rounded-3xl flex flex-col items-center justify-center shadow-xl">
                                        <FaPills className="text-6xl text-purple-500 mb-3" />
                                        <h4 className="font-bold text-lg">
                                            Medicine
                                        </h4>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

