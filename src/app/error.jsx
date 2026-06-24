'use client';

export default function Error({
    error,
    reset,
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">

            <div className="text-7xl mb-4">
                ⚠️
            </div>

            <h1 className="text-4xl font-bold text-red-600">
                Something Went Wrong
            </h1>

            <p className="text-gray-500 mt-3 max-w-md">
                An unexpected error occurred.
                Please try again.
            </p>

            <button
                onClick={() => reset()}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Try Again
            </button>
        </div>
    );
}