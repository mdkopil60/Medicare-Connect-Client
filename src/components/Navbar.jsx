"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Example User (Replace with your auth user)
    const user = {
        name: "John Doe",
        photoURL: "https://i.pravatar.cc/150?img=3",
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        MediCare Connect
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="hover:text-blue-600 transition">
                            Home
                        </Link>

                        <Link
                            href="/find-doctors"
                            className="hover:text-blue-600 transition"
                        >
                            Find Doctors
                        </Link>

                        <Link href="/about" className="hover:text-blue-600 transition">
                            About Us
                        </Link>

                        <Link href="/contact" className="hover:text-blue-600 transition">
                            Contact Us
                        </Link>

                        <Link href="/dashboard" className="hover:text-blue-600 transition">
                            Dashboard
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="dropdown dropdown-end relative group">
                                <img
                                    src={user.photoURL}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer"
                                />

                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <p className="font-semibold px-3 py-2">{user.name}</p>

                                    <hr />

                                    <Link
                                        href="/profile"
                                        className="block px-3 py-2 hover:bg-gray-100 rounded"
                                    >
                                        Profile
                                    </Link>

                                    <Link
                                        href="/dashboard"
                                        className="block px-3 py-2 hover:bg-gray-100 rounded"
                                    >
                                        Dashboard
                                    </Link>

                                    <button className="w-full text-left px-3 py-2 hover:bg-red-100 text-red-500 rounded">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-2xl"
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 flex flex-col gap-3">
                        <Link href="/">Home</Link>

                        <Link href="/find-doctors">Find Doctors</Link>

                        <Link href="/about">About Us</Link>

                        <Link href="/contact">Contact Us</Link>

                        <Link href="/dashboard">Dashboard</Link>

                        {user ? (
                            <>
                                <Link href="/profile">Profile</Link>

                                <button className="text-left text-red-500">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">Login</Link>

                                <Link href="/register">Register</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}