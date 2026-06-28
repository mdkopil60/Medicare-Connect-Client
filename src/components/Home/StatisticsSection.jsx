'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Users, UserRound, CalendarCheck, Star } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STAT_CONFIG = [
    {
        key: 'totalDoctors',
        label: 'Doctors',
        icon: UserRound,
        suffix: '+',
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/10',
    },
    {
        key: 'totalPatients',
        label: 'Patients',
        icon: Users,
        suffix: '+',
        colorClass: 'text-emerald-500',
        bgClass: 'bg-emerald-500/10',
    },
    {
        key: 'totalAppointments',
        label: 'Appointments',
        icon: CalendarCheck,
        suffix: '+',
        colorClass: 'text-violet-500',
        bgClass: 'bg-violet-500/10',
    },
    {
        key: 'totalReviews',
        label: 'Reviews',
        icon: Star,
        suffix: '+',
        colorClass: 'text-amber-500',
        bgClass: 'bg-amber-500/10',
    },
];

function AnimatedNumber({ value }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const motionVal = useMotionValue(0);
    const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (inView) motionVal.set(value);
    }, [inView, value, motionVal]);

    useEffect(() => {
        return spring.on('change', (v) => setDisplay(Math.round(v)));
    }, [spring]);

    return (
        <span ref={ref}>
            {display.toLocaleString()}
        </span>
    );
}

function StatCard({ config, value, index, loading }) {
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="group relative rounded-2xl border border-default-200/60 bg-background p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-default-300 hover:shadow-lg">

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${config.bgClass}`}>
                    <Icon
                        size={26}
                        className={config.colorClass}
                        aria-hidden
                    />
                </div>

                {/* Value */}
                <div className="text-4xl font-black text-foreground tabular-nums">
                    {loading ? (
                        <div className="h-10 w-24 mx-auto rounded-lg bg-default-200 animate-pulse" />
                    ) : (
                        <>
                            <AnimatedNumber value={value} />
                            <span className={`text-2xl ml-0.5 ${config.colorClass}`}>
                                {config.suffix}
                            </span>
                        </>
                    )}
                </div>

                {/* Label */}
                <p className="text-default-500 text-sm font-medium mt-2 uppercase tracking-widest">
                    {config.label}
                </p>

            </div>
        </motion.div>
    );
}

export default function StatisticsSection() {
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalReviews: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${API_BASE}/statistics`)
            .then((res) => setStats(res.data))
            .catch((err) => console.error('Statistics fetch failed:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section
            aria-labelledby="stats-heading"
            className="py-24 bg-default-50 dark:bg-zinc-950"
        >
            <div className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="text-center mb-14"
                >
                    <span className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4">
                        By the numbers
                    </span>

                    <h2
                        id="stats-heading"
                        className="text-4xl md:text-5xl font-black text-foreground"
                    >
                        Platform statistics
                    </h2>

                    <p className="text-default-500 mt-3 text-base">
                        Trusted by thousands of patients across the country.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {STAT_CONFIG.map((config, i) => (
                        <StatCard
                            key={config.key}
                            config={config}
                            value={stats[config.key]}
                            index={i}
                            loading={loading}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}