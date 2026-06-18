'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// import api from '@/lib/api';
import { FaSearch, FaStar } from 'react-icons/fa';

export default function FindDoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General'];

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '9' });
            if (search) params.set('search', search);
            if (specialization) params.set('specialization', specialization);
            if (sort) params.set('sort', sort);

            const res = await api.get(`/doctors?${params.toString()}`);
            setDoctors(res.data.doctors);
            setTotalPages(res.data.totalPages);
        } catch {
            // silent
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDoctors();
    }, [page, specialization, sort]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchDoctors();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Find Doctors</h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-slate-900"
                        />
                    </div>
                    <select
                        value={specialization}
                        onChange={(e) => { setSpecialization(e.target.value); setPage(1); }}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-slate-900"
                    >
                        <option value="">All Specializations</option>
                        {specializations.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); setPage(1); }}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-slate-900"
                    >
                        <option value="">Sort By</option>
                        <option value="fee_asc">Fee: Low to High</option>
                        <option value="fee_desc">Fee: High to Low</option>
                        <option value="exp_desc">Experience: High to Low</option>
                        <option value="rating_desc">Rating: High to Low</option>
                    </select>
                    <button type="submit" className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
                </div>
            ) : doctors.length === 0 ? (
                <p className="text-center text-gray-500 py-20">No doctors found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor, i) => (
                        <motion.div
                            key={doctor._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={doctor.userId?.photo || doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.doctorName}&background=0d9488&color=fff`}
                                    alt={doctor.doctorName}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white">{doctor.doctorName}</h3>
                                    <p className="text-sm text-teal-600">{doctor.specialization}</p>
                                    {doctor.averageRating !== undefined && (
                                        <div className="flex items-center gap-1 text-sm">
                                            <FaStar className="text-yellow-400" />
                                            <span>{doctor.averageRating.toFixed(1)}</span>
                                            <span className="text-gray-400">({doctor.totalReviews})</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mb-4">
                                <span>{doctor.experience} years exp</span>
                                <span className="text-teal-600 font-semibold">${doctor.consultationFee}</span>
                            </div>
                            <Link
                                href={`/doctors/${doctor._id}`}
                                className="block text-center py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-colors"
                            >
                                View Details
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === i + 1
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-white dark:bg-slate-800 border hover:bg-teal-50'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
