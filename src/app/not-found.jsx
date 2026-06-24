import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">

            {/* Illustration */}
            <div className="text-[150px]">
                🚑
            </div>

            {/* Error Message */}
            <h1 className="text-6xl font-bold text-blue-600">
                404
            </h1>

            <h2 className="text-3xl font-semibold mt-4">
                Page Not Found
            </h2>

            <p className="text-gray-500 mt-3 text-center max-w-md">
                Sorry, the page you are looking for does not exist
                or has been moved.
            </p>

            {/* Back Home Button */}
            <Link
                href="/"
                className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
                Back Home
            </Link>
        </div>
    );
}