'use client';
import { useState, useEffect } from 'react';
import { Card, Button, Spinner, Chip } from '@heroui/react';
import { FaBan, FaCheckCircle, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/users');
            setUsers(res.data);
        } catch (err) {
            console.error('fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Status toggle — active ↔ suspended
    const toggleStatus = async (id, currentStatus) => {
        // ✅ lowercase check করা হয়েছে (Better Auth lowercase store করে)
        const isActive = currentStatus?.toLowerCase() === 'active';
        const nextStatus = isActive ? 'suspended' : 'active';

        try {
            const res = await axios.patch(
                `http://localhost:5000/users/status/${id}`,
                { status: nextStatus }
            );

            if (res.data.modifiedCount > 0) {
                setUsers(prev =>
                    prev.map(u => u._id === id ? { ...u, status: nextStatus } : u)
                );
                Swal.fire({
                    icon: 'success',
                    title: `User ${nextStatus === 'suspended' ? 'Suspended' : 'Activated'}`,
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    // User Delete
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Delete User?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete'
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axios.delete(`http://localhost:5000/users/${id}`);
            if (res.data.deletedCount > 0) {
                setUsers(prev => prev.filter(u => u._id !== id));
                Swal.fire({
                    icon: 'success',
                    title: 'User Deleted',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to delete user', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-20">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">User Directory</h1>
                <p className="text-sm text-default-400 mt-1">
                    Total {users.length} users registered
                </p>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-divider bg-default-50">
                            <th className="p-4 text-xs font-semibold text-default-500 uppercase tracking-wider">Name</th>
                            <th className="p-4 text-xs font-semibold text-default-500 uppercase tracking-wider">Email</th>
                            <th className="p-4 text-xs font-semibold text-default-500 uppercase tracking-wider">Role</th>
                            <th className="p-4 text-xs font-semibold text-default-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-semibold text-default-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-default-400">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map(u => {
                                const isActive = u.status?.toLowerCase() !== 'suspended';
                                return (
                                    <tr key={u._id} className="border-b border-divider hover:bg-default-50/50 transition-colors">
                                        <td className="p-4 font-medium text-foreground">
                                            {u.name || '—'}
                                        </td>
                                        <td className="p-4 text-default-500 text-sm">
                                            {u.email}
                                        </td>
                                        <td className="p-4">
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={u.role === 'admin' ? 'secondary' : u.role === 'doctor' ? 'primary' : 'default'}
                                                className="capitalize"
                                            >
                                                {u.role || 'patient'}
                                            </Chip>
                                        </td>
                                        <td className="p-4">
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={isActive ? 'success' : 'danger'}
                                                className="capitalize"
                                            >
                                                {isActive ? 'Active' : 'Suspended'}
                                            </Chip>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {/* Suspend / Activate */}
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color={isActive ? 'warning' : 'success'}
                                                    onClick={() => toggleStatus(u._id, u.status)}
                                                    startContent={isActive ? <FaBan size={12} /> : <FaCheckCircle size={12} />}
                                                >
                                                    {isActive ? 'Suspend' : 'Activate'}
                                                </Button>

                                                {/* Delete */}
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="danger"
                                                    onClick={() => handleDelete(u._id)}
                                                    isIconOnly
                                                >
                                                    <FaTrash size={12} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}