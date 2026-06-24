'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Spinner } from '@heroui/react';
import { FaUserMd, FaGraduationCap, FaBriefcase, FaDollarSign, FaClock, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function DoctorProfileManagementPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔑 সিকিউরিটি হেডার গেটার মেথড
    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    // 📥 ১. ডেটাবেজ থেকে ডক্টরের নিজস্ব প্রোফাইল ডেটা লোড করা (Read)
    const fetchDoctorProfile = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/doctors/profile/me', getAuthHeaders());
            setProfile(res.data);
        } catch (err) {
            console.error("Error fetching doctor profile:", err);
            Swal.fire({ icon: 'error', title: 'Failed to load profile details' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctorProfile();
    }, []);

    // 🔄 ২. SweetAlert2 ফর্ম পপআপের মাধ্যমে প্রোফাইল ডেটা আপডেট করা (Update)
    const openEditProfilePopup = () => {
        if (!profile) return;

        Swal.fire({
            title: 'Update Profile Details',
            html: `
        <div style="text-align: left; font-family: sans-serif;">
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Qualifications</label>
            <input type="text" id="swal-qualifications" value="${profile.qualifications || ''}" placeholder="e.g. MBBS, MD" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Experience Description</label>
            <input type="text" id="swal-experience" value="${profile.experience || ''}" placeholder="e.g. 10 Years of Experience" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Consultation Fee ($ / BDT)</label>
            <input type="number" id="swal-fee" value="${profile.consultationFee || 0}" min="0" style="width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none;" />
          </div>

          <div>
            <label style="display:block; font-size:12px; font-weight:bold; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Available Slots Summary</label>
            <textarea id="swal-slots" placeholder="e.g. Mon, Wed (09:00 AM - 01:00 PM)" style="width:100%; height:60px; padding:10px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none; resize: none;">${profile.slotsDescription || ''}</textarea>
          </div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Update Profile',
            cancelButtonText: 'Cancel',
            focusConfirm: false,
            preConfirm: () => {
                const qualifications = document.getElementById('swal-qualifications').value;
                const experience = document.getElementById('swal-experience').value;
                const consultationFee = document.getElementById('swal-fee').value;
                const slotsDescription = document.getElementById('swal-slots').value;

                if (!qualifications || !experience || !consultationFee || !slotsDescription) {
                    Swal.showValidationMessage('All profile fields are required');
                    return false;
                }
                return { qualifications, experience, consultationFee: parseInt(consultationFee), slotsDescription };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // 🔄 ব্যাকএন্ড এপিআই কল: প্রোফাইল ডেটা আপডেট
                    const res = await axios.patch('http://localhost:5000/doctors/profile/update', result.value, getAuthHeaders());

                    // ডেটাবেজের লেটেস্ট রেসপন্স দিয়ে ফ্রন্টএন্ড স্টেট আপডেট
                    setProfile(res.data);
                    Swal.fire({ icon: 'success', title: 'Profile updated successfully!', timer: 1500, showConfirmButton: false });
                } catch (err) {
                    console.error("Error updating doctor profile:", err);
                    Swal.fire({ icon: 'error', title: 'Update failed', text: err.response?.data?.message || 'Server error occurred.' });
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Spinner size="lg" color="teal" />
                <p className="text-sm text-slate-500 font-medium animate-pulse">Loading secure profile details...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                        <FaUserMd className="text-teal-600" /> Profile Management
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1">View and maintain your professional medical details</p>
                </div>
                <Button
                    onPress={openEditProfilePopup}
                    color="primary"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/10 cursor-pointer"
                    startContent={<FaEdit />}
                >
                    Edit Profile Details
                </Button>
            </div>

            {/* Profile Metrics Layout */}
            {profile && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Card: Doctor Overview */}
                    <Card className="p-6 border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100/50 dark:border-teal-900/30 flex items-center justify-center mb-4">
                            <FaUserMd className="text-4xl text-teal-600" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{profile.name}</h2>
                        <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mt-1">{profile.specialty}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">{profile.email}</p>
                    </Card>

                    {/* Right Card: Dynamic Configurable Attributes */}
                    <Card className="md:col-span-2 p-6 border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900 space-y-6">

                        {/* Qualifications Row */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 mt-0.5">
                                <FaGraduationCap className="text-lg text-teal-600" />
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qualifications</span>
                                <p className="text-slate-700 dark:text-slate-200 font-semibold mt-1 text-sm md:text-base">
                                    {profile.qualifications}
                                </p>
                            </div>
                        </div>

                        {/* Experience Row */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 mt-0.5">
                                <FaBriefcase className="text-lg text-teal-600" />
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Experience</span>
                                <p className="text-slate-700 dark:text-slate-200 font-semibold mt-1 text-sm md:text-base">
                                    {profile.experience}
                                </p>
                            </div>
                        </div>

                        {/* Fee Row */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 mt-0.5">
                                <FaDollarSign className="text-lg text-teal-600" />
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consultation Fee</span>
                                <p className="text-slate-800 dark:text-teal-400 font-mono font-black mt-1 text-base md:text-lg">
                                    {profile.consultationFee} BDT / USD
                                </p>
                            </div>
                        </div>

                        {/* Available Slots Row */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 mt-0.5">
                                <FaClock className="text-lg text-teal-600" />
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Summary Slots</span>
                                <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm mt-1 bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-3 rounded-xl leading-relaxed whitespace-pre-line">
                                    {profile.slotsDescription}
                                </p>
                            </div>
                        </div>

                    </Card>

                </div>
            )}
        </div>
    );
}