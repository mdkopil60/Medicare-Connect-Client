'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@heroui/react';
import { FaUsers, FaBan, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access-token");
        return { headers: { authorization: `Bearer ${token}` } };
    };

    // 📥 ডাটাবেজ থেকে ইউজার লিস্ট লোড করা
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/users', getAuthHeaders());
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching users:", err);
            Swal.fire({ icon: 'error', title: 'Failed to load user directory' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 🔄 ইউজার স্ট্যাটাস (Suspend/Active) টগল করা
    const handleSuspendUser = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';

        const result = await Swal.fire({
            title: `${currentStatus === 'Suspended' ? 'Unsuspend' : 'Suspend'} User?`,
            text: `Change access level to ${nextStatus}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            confirmButtonText: 'Yes, Confirm'
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(`http://localhost:5000/users/status/${id}`, { status: nextStatus }, getAuthHeaders());
                setUsers(prev => prev.map(u => u._id === id ? { ...u, status: nextStatus } : u));
                Swal.fire('Updated!', `User status is now ${nextStatus}.`, 'success');
            } catch (err) {
                Swal.fire('Error', 'Could not update user status.', 'error');
            }
        }
    };

    // 🗑️ ইউজার পার্মানেন্টলি ডিলিট করা
    const handleDeleteUser = async (id) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: "This action cannot be undone!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/users/${id}`, getAuthHeaders());
                setUsers(prev => prev.filter(u => u._id !== id));
                Swal.fire('Deleted!', 'User record purged.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Failed to delete user.', 'error');
            }
        }
    };

    return (
        <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <FaUsers className="text-teal-600 text-lg" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">Registered Users Account Control</h3>
            </div>

            <div className="overflow-x-auto w-full">
                {loading ? (
                    <div className="flex justify-center p-10"><Spinner color="teal" /></div>
                ) : (
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold text-xs uppercase">
                                <th className="p-3 pl-4">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800/40 last:border-0 text-slate-700 dark:text-slate-300">
                                    <td className="p-3 pl-4 font-semibold">{u.name}</td>
                                    <td className="p-3 text-slate-400">{u.email}</td>
                                    <td className="p-3 text-xs">
                                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 font-bold">{u.role}</span>
                                    </td>
                                    <td className="p-3 text-xs">
                                        <span className={`px-2 py-0.5 rounded font-bold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center pr-4">
                                        <div className="flex justify-center items-center gap-1">
                                            <Button size="sm" variant="flat" isIconOnly className="text-amber-600 dark:text-amber-400 rounded-lg" onPress={() => handleSuspendUser(u._id, u.status)}><FaBan /></Button>
                                            <Button size="sm" variant="flat" isIconOnly className="text-red-600 dark:text-red-400 rounded-lg" onPress={() => handleDeleteUser(u._id)}><FaTrash /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}