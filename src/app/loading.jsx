export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            <h2 className="mt-6 text-2xl font-bold text-slate-800">
                Loading...
            </h2>

            <p className="text-slate-500 mt-2">
                Please wait while we prepare your page.
            </p>
        </div>
    );
}