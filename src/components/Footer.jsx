"use client";

import Link from "next/link";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHeartbeat,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* Logo */}
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-2xl font-black"
                        >
                            <FaHeartbeat className="text-cyan-400" />

                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                MediCare Connect
                            </span>
                        </Link>

                        <p className="mt-5 text-slate-400 leading-relaxed">
                            Connecting patients with trusted doctors and
                            healthcare services through a secure and modern
                            healthcare platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-5">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
                            {[
                                ["Home", "/"],
                                ["Find Doctors", "/find-doctors"],
                                ["About Us", "/about"],
                                ["Contact Us", "/contact"],
                                ["Dashboard", "/dashboard"],
                            ].map(([title, link]) => (
                                <li key={title}>
                                    <Link
                                        href={link}
                                        className="text-slate-400 hover:text-cyan-400 transition"
                                    >
                                        {title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-5">
                            Contact Information
                        </h3>

                        <div className="space-y-4">

                            <div className="flex gap-3">
                                <FaMapMarkerAlt className="text-cyan-400 mt-1" />
                                <span className="text-slate-400">
                                    Dhaka, Bangladesh
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <FaEnvelope className="text-cyan-400 mt-1" />
                                <span className="text-slate-400">
                                    support@medicareconnect.com
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <FaPhoneAlt className="text-cyan-400 mt-1" />
                                <span className="text-slate-400">
                                    +880 1234-567890
                                </span>
                            </div>

                        </div>

                        <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                            <p className="text-red-400 font-semibold">
                                Emergency Hotline
                            </p>

                            <h4 className="text-2xl font-black mt-1">
                                999
                            </h4>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-lg font-bold mb-5">
                            Follow Us
                        </h3>

                        <p className="text-slate-400 mb-5">
                            Stay connected for healthcare updates,
                            wellness tips, and medical news.
                        </p>

                        <div className="flex gap-4">

                            <a
                                href="#"
                                className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition"
                            >
                                <FaFacebookF />
                            </a>

                            <a
                                href="#"
                                className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition"
                            >
                                <FaTwitter />
                            </a>

                            <a
                                href="#"
                                className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 transition"
                            >
                                <FaInstagram />
                            </a>

                            <a
                                href="#"
                                className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 transition"
                            >
                                <FaLinkedinIn />
                            </a>

                        </div>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="mt-14 border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} MediCare Connect.
                        All Rights Reserved.
                    </p>

                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link href="/privacy" className="hover:text-cyan-400">
                            Privacy Policy
                        </Link>

                        <Link href="/terms" className="hover:text-cyan-400">
                            Terms of Service
                        </Link>
                    </div>

                </div>

            </div>
        </footer>
    );
}

