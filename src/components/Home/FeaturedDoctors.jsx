'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Briefcase, DollarSign, ChevronRight, AlertCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CARD_VARIANTS = {
    hidden: { opacity: 0, y: 32 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
};

function DoctorCard({ doctor, index }) {
    return (
        <motion.article
            key={doctor._id}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={CARD_VARIANTS}
            className="group relative flex flex-col rounded-3xl border border-default-200/60 bg-background/80 backdrop-blur-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_20px_48px_rgba(99,102,241,0.12)]"
        >
            {/* Avatar */}
            <div className="flex justify-center mb-5">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 opacity-30 blur-md scale-110" />
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/80 dark:border-zinc-700 shadow-lg bg-primary/10">
                        {doctor.profileImage ? (
                            <img
                                src={doctor.profileImage}
                                alt={`Photo of ${doctor.doctorName}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User size={36} className="text-primary/60" aria-hidden />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Specialization badge */}
            <div className="flex justify-center mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/15">
                    {doctor.specialization}
                </span>
            </div>

            {/* Name & qualification */}
            <h3 className="text-center text-xl font-bold text-foreground leading-snug">
                {doctor.doctorName}
            </h3>
            {doctor.qualifications && (
                <p className="text-center text-default-500 text-sm mt-1 mb-5">
                    {doctor.qualifications}
                </p>
            )}

            {/* Stats */}
            <div className="mt-auto space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-default-100/70 dark:bg-zinc-900/80 px-3.5 py-2.5">
                    <span className="flex items-center gap-2 text-sm text-default-500">
                        <Briefcase size={14} aria-hidden />
                        Experience
                    </span>
                    <span className="text-sm font-semibold text-primary">
                        {doctor.experience ?? 0} yrs
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-default-100/70 dark:bg-zinc-900/80 px-3.5 py-2.5">
                    <span className="flex items-center gap-2 text-sm text-default-500">
                        <DollarSign size={14} aria-hidden />
                        Consultation
                    </span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        ${doctor.consultationFee}
                    </span>
                </div>
            </div>

            {/* CTA */}
            <Link
                href={`/find-doctors/${doctor._id}`}
                className="mt-5 flex items-center justify-center gap-1.5 w-full rounded-2xl py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                View profile
                <ChevronRight size={15} aria-hidden />
            </Link>
        </motion.article>
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-3xl border border-default-200/60 bg-background/80 p-6 animate-pulse">
            <div className="flex justify-center mb-5">
                <div className="w-24 h-24 rounded-full bg-default-200" />
            </div>
            <div className="flex justify-center mb-3">
                <div className="h-5 w-24 rounded-full bg-default-200" />
            </div>
            <div className="h-6 w-3/4 mx-auto rounded-lg bg-default-200 mb-2" />
            <div className="h-4 w-1/2 mx-auto rounded-lg bg-default-100 mb-6" />
            <div className="space-y-2.5">
                <div className="h-10 rounded-xl bg-default-100" />
                <div className="h-10 rounded-xl bg-default-100" />
            </div>
            <div className="mt-5 h-10 rounded-2xl bg-default-200" />
        </div>
    );
}

function ErrorState({ onRetry }) {
    return (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
            <AlertCircle size={36} className="text-danger/70" aria-hidden />
            <p className="text-default-500 text-sm">
                Couldn&apos;t load doctors right now.
            </p>
            <button
                onClick={onRetry}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-default-300 hover:bg-default-100 transition-colors"
            >
                Try again
            </button>
        </div>
    );
}

export default function FeaturedDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'

    const fetchDoctors = () => {
        setStatus('loading');
        axios
            .get(`${API_BASE}/doctors?limit=3`)
            .then((res) => {
                setDoctors(res.data?.doctors ?? res.data ?? []);
                setStatus('success');
            })
            .catch(() => setStatus('error'));
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <section
            aria-labelledby="featured-doctors-heading"
            className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950"
        >
            {/* Ambient blobs */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[140px] translate-x-1/2 translate-y-1/2"
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <span className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
                        Featured doctors
                    </span>

                    <h2
                        id="featured-doctors-heading"
                        className="mt-4 text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent leading-tight"
                    >
                        Meet our expert specialists
                    </h2>

                    <p className="mt-4 text-default-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        Connect with trusted healthcare professionals and get world-class
                        medical consultations from verified experts.
                    </p>
                </motion.div>

                {/* Grid */}
                {status === 'error' ? (
                    <ErrorState onRetry={fetchDoctors} />
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {status === 'loading'
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))
                            : doctors.map((doctor, i) => (
                                <DoctorCard key={doctor._id} doctor={doctor} index={i} />
                            ))}
                    </div>
                )}

                {/* Footer CTA */}
                {status === 'success' && doctors.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center mt-12"
                    >
                        <Link
                            href="/find-doctors"
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-semibold text-white text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            View all doctors
                            <ChevronRight size={16} aria-hidden />
                        </Link>
                    </motion.div>
                )}

            </div>
        </section>
    );
}