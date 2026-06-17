import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo & Description */}
                    <div>
                        <Link
                            href="/"
                            className="text-2xl font-bold text-white"
                        >
                            MediCare Connect
                        </Link>

                        <p className="mt-4 text-sm leading-6">
                            Connecting patients with trusted doctors and
                            healthcare services through a modern and
                            reliable appointment management platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h3>

                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-blue-400 transition"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/find-doctors"
                                    className="hover:text-blue-400 transition"
                                >
                                    Find Doctors
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-blue-400 transition"
                                >
                                    About Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/contact"
                                    className="hover:text-blue-400 transition"
                                >
                                    Contact Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/dashboard"
                                    className="hover:text-blue-400 transition"
                                >
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Contact Information
                        </h3>

                        <div className="space-y-2 text-sm">
                            <p>📍 Dhaka, Bangladesh</p>
                            <p>📧 support@medicareconnect.com</p>
                            <p>📞 +880 1234-567890</p>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold text-red-400">
                                Emergency Hotline
                            </h4>

                            <p className="text-xl font-bold text-white mt-2">
                                999
                            </p>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Follow Us
                        </h3>

                        <div className="flex gap-4 text-2xl">
                            <a
                                href="#"
                                className="hover:text-blue-500 transition"
                            >
                                Facebook
                            </a>

                            <a
                                href="#"
                                className="hover:text-sky-400 transition"
                            >
                                Twitter
                            </a>

                            <a
                                href="#"
                                className="hover:text-pink-500 transition"
                            >
                                Instagram
                            </a>

                            <a
                                href="#"
                                className="hover:text-blue-300 transition"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-slate-700 mt-10 pt-6 text-center text-sm">
                    <p>
                        © {new Date().getFullYear()} MediCare Connect.
                        All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}