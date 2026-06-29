'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, Spinner } from '@heroui/react';
import { FaSave, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SPECIALIZATIONS = [
    'Cardiologist', 'Pediatrician', 'Neurologist', 'Orthopedic Surgeon',
    'Dermatologist', 'General Physician', 'Gynecologist', 'Psychiatrist', 'ENT Specialist'
];

export default function DoctorProfilePage() {
    const { data: session, isPending } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        doctorName: '', specialization: '', hospitalName: '',
        experience: '', consultationFee: '', profileImage: '',
        qualifications: [], availableDays: [], availableSlots: []
    });

    const [qualInput, setQualInput] = useState('');
    const [newSlot, setNewSlot] = useState({
        day: 'Saturday', startTime: '09:00', endTime: '13:00', maxPatients: 10
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };
    useEffect(() => {
        if (isPending || !session?.user?.email) return;
        const email = session.user.email;

        axios.get(`${API_URL}/doctor/profile/${email}`, getAuthHeaders())
            .then(res => {
                const d = res.data;
                setForm({
                    doctorName: d.doctorName || '',
                    specialization: d.specialization || '',
                    hospitalName: d.hospitalName || '',
                    experience: d.experience || '',
                    consultationFee: d.consultationFee || '',
                    profileImage: d.profileImage || '',
                    qualifications: d.qualifications
                        ? (typeof d.qualifications === 'string'
                            ? d.qualifications.split(',').map(q => q.trim())
                            : d.qualifications)
                        : [],
                    availableDays: d.availableDays || [],
                    availableSlots: d.availableSlots || []
                });
            })
            .catch(err => console.error('Profile load error:', err))
            .finally(() => setLoading(false));
    }, [session, isPending]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Qualification add/remove
    const addQual = () => {
        if (!qualInput.trim()) return;
        setForm(prev => ({ ...prev, qualifications: [...prev.qualifications, qualInput.trim()] }));
        setQualInput('');
    };
    const removeQual = (i) => {
        setForm(prev => ({ ...prev, qualifications: prev.qualifications.filter((_, idx) => idx !== i) }));
    };

    // Day toggle
    const toggleDay = (day) => {
        setForm(prev => ({
            ...prev,
            availableDays: prev.availableDays.includes(day)
                ? prev.availableDays.filter(d => d !== day)
                : [...prev.availableDays, day]
        }));
    };

    // Slot add/remove
    const addSlot = () => {
        const slot = { ...newSlot, maxPatients: parseInt(newSlot.maxPatients) };
        setForm(prev => ({
            ...prev,
            availableSlots: [...prev.availableSlots, slot],
            availableDays: [...new Set([...prev.availableDays, slot.day])]
        }));
    };
    const removeSlot = (i) => {
        setForm(prev => ({ ...prev, availableSlots: prev.availableSlots.filter((_, idx) => idx !== i) }));
    };

    // Save
    const handleSave = async () => {
        const email = session?.user?.email;
        if (!email) return;
        try {
            setSaving(true);
            await axios.put(
                `${API_URL}/doctor/profile/${email}`,
                form,
                getAuthHeaders()
            );
            Swal.fire({ icon: 'success', title: 'Profile updated!', timer: 1800, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Save failed', text: err.response?.data?.message || err.message });
        } finally {
            setSaving(false);
        }
    };

    if (isPending || loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size="lg" color="primary" />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profile management</h1>
                <p className="text-sm text-slate-400 mt-1">UPDATE</p>
            </div>

            {/* Basic Info */}
            <Card className="p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Basic information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Doctor name', name: 'doctorName', type: 'text' },
                        { label: 'Hospital / Clinic', name: 'hospitalName', type: 'text' },
                        { label: 'Experience (years)', name: 'experience', type: 'number' },
                        { label: 'Consultation fee ($)', name: 'consultationFee', type: 'number' },
                        { label: 'Profile image URL', name: 'profileImage', type: 'text' },
                    ].map(f => (
                        <div key={f.name} className="flex flex-col gap-1">
                            <label className="text-xs text-slate-500">{f.label}</label>
                            <input
                                type={f.type} name={f.name} value={form[f.name]}
                                onChange={handleChange}
                                className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-teal-400"
                            />
                        </div>
                    ))}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-500">Specialization</label>
                        <select
                            name="specialization" value={form.specialization} onChange={handleChange}
                            className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-teal-400"
                        >
                            {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Qualifications */}
            <Card className="p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Qualifications</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                    {form.qualifications.map((q, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                            {q}
                            <FaTimes className="cursor-pointer text-slate-400 hover:text-red-500" onClick={() => removeQual(i)} />
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        value={qualInput} onChange={e => setQualInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addQual()}
                        placeholder="যেমন: MBBS, MD, FCPS"
                        className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 focus:outline-none focus:border-teal-400"
                    />
                    <button onClick={addQual} className="flex items-center gap-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
                        <FaPlus className="text-xs" /> Add
                    </button>
                </div>
            </Card>

            {/* Available Days */}
            <Card className="p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Available days</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                    {DAYS.map(day => (
                        <button
                            key={day} onClick={() => toggleDay(day)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${form.availableDays.includes(day)
                                    ? 'bg-teal-600 text-white border-teal-600'
                                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                                }`}
                        >{day}</button>
                    ))}
                </div>

                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Time slots</h2>

                {/* Existing slots */}
                {form.availableSlots.length > 0 && (
                    <div className="mb-4 overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 uppercase">
                                    <th className="text-left py-2 px-2">Day</th>
                                    <th className="text-left py-2 px-2">Start</th>
                                    <th className="text-left py-2 px-2">End</th>
                                    <th className="text-left py-2 px-2">Max patients</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {form.availableSlots.map((slot, i) => (
                                    <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                                        <td className="py-2 px-2 text-slate-600 dark:text-slate-300">{slot.day}</td>
                                        <td className="py-2 px-2 text-slate-600 dark:text-slate-300">{slot.startTime}</td>
                                        <td className="py-2 px-2 text-slate-600 dark:text-slate-300">{slot.endTime}</td>
                                        <td className="py-2 px-2 text-slate-600 dark:text-slate-300">{slot.maxPatients}</td>
                                        <td className="py-2 px-2">
                                            <button onClick={() => removeSlot(i)} className="text-red-400 hover:text-red-600">
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add new slot */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                    {[
                        { label: 'Day', type: 'select', key: 'day', options: DAYS },
                        { label: 'Start', type: 'time', key: 'startTime' },
                        { label: 'End', type: 'time', key: 'endTime' },
                        { label: 'Max patients', type: 'number', key: 'maxPatients' },
                    ].map(f => (
                        <div key={f.key} className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400">{f.label}</label>
                            {f.type === 'select' ? (
                                <select
                                    value={newSlot[f.key]}
                                    onChange={e => setNewSlot(p => ({ ...p, [f.key]: e.target.value }))}
                                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none"
                                >
                                    {f.options.map(o => <option key={o}>{o}</option>)}
                                </select>
                            ) : (
                                <input
                                    type={f.type} value={newSlot[f.key]}
                                    onChange={e => setNewSlot(p => ({ ...p, [f.key]: e.target.value }))}
                                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none"
                                />
                            )}
                        </div>
                    ))}
                    <button onClick={addSlot} className="flex items-center justify-center gap-1 px-3 py-2 bg-teal-600 text-white rounded-lg text-xs hover:bg-teal-700">
                        <FaPlus /> Add slot
                    </button>
                </div>
            </Card>

            {/* Save */}
            <div className="flex justify-end gap-3 pb-6">
                <button
                    onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-60"
                >
                    <FaSave /> {saving ? 'Saving...' : 'Save profile'}
                </button>
            </div>
        </div>
    );
}