"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                    setIsMenuOpen(false);
                },
            },
        });
    };

    return (
        <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">

                    {/* Logo & Dark Mode Toggle */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            MediCare Connect
                        </Link>
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xl"
                                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {theme === "dark" ? "☀️" : "🌙"}
                            </button>
                        )}
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
                        <Link href="/find-doctors" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Find Doctors</Link>
                        <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">About Us</Link>
                        <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact Us</Link>
                        <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Dashboard</Link>
                    </div>

                    {/* Right Side (Auth Buttons) */}
                    <div className="hidden md:flex items-center gap-4">
                        {!isPending && user ? (
                            <div className="dropdown dropdown-end relative group">
                                <img
                                    src={user.image || "https://i.pravatar.cc/150"}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer object-cover"
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <p className="font-semibold px-3 py-2 truncate">{user.name}</p>
                                    <hr className="dark:border-gray-700" />
                                    <Link href="/profile" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Profile</Link>
                                    <Link href="/dashboard" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Dashboard</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            !isPending && (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Register
                                    </Link>
                                </>
                            )
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
                    <div className="md:hidden pb-4 flex flex-col gap-3 border-t dark:border-gray-700 pt-2">
                        <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link href="/find-doctors" onClick={() => setIsMenuOpen(false)}>Find Doctors</Link>
                        <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                        <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>

                        <hr className="dark:border-gray-700" />

                        {!isPending && user ? (
                            <>
                                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                                <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
                            </>
                        ) : (
                            !isPending && (
                                <div className="flex flex-col gap-2 pt-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-center py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-center py-2 bg-blue-600 text-white rounded-lg"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}