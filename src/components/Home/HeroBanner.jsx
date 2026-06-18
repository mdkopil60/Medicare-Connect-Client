'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaUserMd, FaHeartbeat, FaHospital } from 'react-icons/fa';

export default function HeroBanner() {
    return (<section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700">

        ```
        {/* Background Shapes */}
        <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6">
                        🩺 Trusted Healthcare Platform
                    </span>

                    <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">
                        Your Health,
                        <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                            Our Priority
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-white/80 max-w-xl leading-relaxed">
                        Book appointments with top doctors, manage medical records,
                        and get quality healthcare services from anywhere, anytime.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link
                            href="/find-doctors"
                            className="px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold shadow-xl hover:scale-105 transition"
                        >
                            Find Doctors
                        </Link>

                        <Link
                            href="/about"
                            className="px-8 py-4 rounded-xl border border-white/40 text-white backdrop-blur-md hover:bg-white/10 transition"
                        >
                            Learn More
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-12">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                            <h3 className="text-3xl font-bold text-yellow-300">500+</h3>
                            <p className="text-white/70 text-sm">Doctors</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                            <h3 className="text-3xl font-bold text-pink-300">10K+</h3>
                            <p className="text-white/70 text-sm">Patients</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                            <h3 className="text-3xl font-bold text-cyan-300">50+</h3>
                            <p className="text-white/70 text-sm">Hospitals</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="hidden lg:flex justify-center"
                >
                    <div className="relative">

                        {/* Main Card */}
                        <div className="w-[420px] h-[420px] rounded-[40px] bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center">

                            <div className="grid grid-cols-2 gap-6">

                                <div className="bg-white rounded-3xl p-6 text-center shadow-lg">
                                    <FaUserMd className="text-5xl text-blue-600 mx-auto mb-3" />
                                    <h4 className="font-bold">Expert Doctors</h4>
                                </div>

                                <div className="bg-white rounded-3xl p-6 text-center shadow-lg">
                                    <FaHeartbeat className="text-5xl text-red-500 mx-auto mb-3" />
                                    <h4 className="font-bold">24/7 Care</h4>
                                </div>

                                <div className="bg-white rounded-3xl p-6 text-center shadow-lg">
                                    <FaHospital className="text-5xl text-green-500 mx-auto mb-3" />
                                    <h4 className="font-bold">Hospitals</h4>
                                </div>

                                <div className="bg-white rounded-3xl p-6 text-center shadow-lg">
                                    <div className="text-5xl">💊</div>
                                    <h4 className="font-bold mt-3">Medicine</h4>
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
