'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card } from '@heroui/react';
import {
    FaUserMd,
    FaUsers,
    FaCalendarCheck,
    FaStar,
} from 'react-icons/fa';

export default function StatisticsSection() {
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalReviews: 0,
    });

    useEffect(() => {
        axios
            .get('http://localhost:5000/statistics')
            .then((res) => setStats(res.data))
            .catch((err) => console.log(err));
    }, []);

    const statCards = [
        {
            title: 'Doctors',
            value: stats.totalDoctors,
            icon: FaUserMd,
            color: 'text-blue-500',
        },
        {
            title: 'Patients',
            value: stats.totalPatients,
            icon: FaUsers,
            color: 'text-green-500',
        },
        {
            title: 'Appointments',
            value: stats.totalAppointments,
            icon: FaCalendarCheck,
            color: 'text-purple-500',
        },
        {
            title: 'Reviews',
            value: stats.totalReviews,
            icon: FaStar,
            color: 'text-yellow-500',
        },
    ];

    return (
        <section className="py-24 bg-default-50 dark:bg-background">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black">
                        Platform Statistics
                    </h2>
                    <p className="text-default-500 mt-3">
                        Trusted by thousands of patients.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-8 text-center">
                                    <Icon
                                        className={`mx-auto text-5xl mb-4 ${item.color}`}
                                    />
                                    <h3 className="text-4xl font-black">
                                        {item.value}
                                    </h3>
                                    <p className="text-default-500 mt-2">
                                        {item.title}
                                    </p>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

