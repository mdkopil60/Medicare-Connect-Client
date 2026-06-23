'use client';

import { useState } from 'react';
import { Card, Button } from '@heroui/react';
import { FaUsers, FaBan, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const INITIAL_USERS = [
    { _id: "usr-01", name: "Alex Jones", email: "alex@example.com", role: "Patient", status: "Active" },
    { _id: "usr-02", name: "David Miller", email: "david@example.com", role: "Patient", status: "Suspended" },
    { _id: "usr-03", name: "Jessica Alba", email: "jessica@example.com", role: "Patient", status: "Active" }
];

export default function ManageUsersPage() {
    const [users, setUsers] = useState(INITIAL_USERS);

    const handleSuspendUser = (id, currentStatus) => {
        const nextStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
        Swal.fire({
            title: `${currentStatus === 'Suspended' ? 'Unsuspend' : 'Suspend'} User?`,
            text: `Change registration access level to ${nextStatus}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Update'
        }).then((result) => {
            if (result.isConfirmed) {
                setUsers(prev => prev.map(u => u._id === id ? { ...u, status: nextStatus } : u));
                Swal.fire('Updated!', `User status modified to ${nextStatus}.`, 'success');
            }
        });
    };

    const handleDeleteUser = (id) => {
        Swal.fire({
            title: 'Permanently Delete User?',
            text: "This operation cannot be reverted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Delete'
        }).then((result) => {
            if (result.isConfirmed) {
                setUsers(prev => prev.filter(u => u._id !== id));
                Swal.fire('Deleted!', 'User record has been purged.', 'success');
            }
        });
    };

    return (
        <Card className="p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <FaUsers className="text-teal-600 text-lg" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">Registered Users Account Control</h3>
            </div>
            <div className="overflow-x-auto w-full">
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
                                <td className="p-3 text-xs"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/30 font-bold">{u.role}</span></td>
                                <td className="p-3 text-xs"><span className={`px-2 py-0.5 rounded font-bold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{u.status}</span></td>
                                <td className="p-3 text-center pr-4">
                                    <div className="flex justify-center items-center gap-1">
                                        <Button size="sm" variant="flat" isIconOnly className="text-amber-600 rounded-lg" onPress={() => handleSuspendUser(u._id, u.status)}><FaBan /></Button>
                                        <Button size="sm" variant="flat" isIconOnly className="text-red-600 rounded-lg" onPress={() => handleDeleteUser(u._id)}><FaTrash /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}