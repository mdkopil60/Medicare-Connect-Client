'use client';
import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@heroui/react';
import { FaBan, FaCheckCircle } from 'react-icons/fa'; // FaCheckCircle যোগ করলাম
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // লোডিং স্টেট

    useEffect(() => {
        axios.get('http://localhost:5000/users', { withCredentials: true })
            .then(res => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        try {
            await axios.patch(`http://localhost:5000/users/status/${id}`, { status: nextStatus }, { withCredentials: true });
            setUsers(users.map(u => u._id === id ? { ...u, status: nextStatus } : u));
            Swal.fire('Success', `User is now ${nextStatus}`, 'success');
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;

    return (
        <Card className="p-5">
            <h3 className="font-bold mb-4">User Directory</h3>
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                        <th className="p-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id} className="border-b">
                            <td className="p-3">{u.name}</td>
                            <td className="p-3">{u.email}</td>
                            <td className="p-3">{u.role}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {u.status}
                                </span>
                            </td>
                            <td className="p-3 flex gap-2">
                                <Button
                                    size="sm"
                                    color={u.status === 'Active' ? "warning" : "success"}
                                    onClick={() => toggleStatus(u._id, u.status)}
                                >
                                    {u.status === 'Active' ? <FaBan /> : <FaCheckCircle />}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}