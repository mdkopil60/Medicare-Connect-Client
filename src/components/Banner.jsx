import Link from "next/link";

export default function Banner() {
    return (
        <section className="bg-gradient-to-r from-blue-50 to-cyan-100">
            <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-10 items-center">

                    {/* Content */}
                    <div>
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            Trusted Healthcare Platform
                        </span>

                        <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Your Health,
                            <span className="text-blue-600"> Our Priority</span>
                        </h1>

                        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                            Book appointments with trusted doctors, manage
                            your healthcare records, and receive quality
                            medical services from the comfort of your home.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href="/find-doctors"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Book Appointment
                            </Link>

                            <Link
                                href="/about"
                                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                            >
                                Learn More
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-10 flex flex-wrap gap-8">
                            <div>
                                <h3 className="text-2xl font-bold text-blue-600">
                                    100+
                                </h3>
                                <p className="text-gray-600">Expert Doctors</p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-blue-600">
                                    5K+
                                </h3>
                                <p className="text-gray-600">Happy Patients</p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-blue-600">
                                    24/7
                                </h3>
                                <p className="text-gray-600">Support</p>
                            </div>
                        </div>
                    </div>

                    {/* Banner Image */}
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=1000"
                            alt="Healthcare Banner"
                            className="w-full rounded-3xl shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}