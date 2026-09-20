import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({
                                          message,
                                          retry,
                                      }) {
    return (
        <div className="bg-red-950 border border-red-700 rounded-2xl p-8 text-center">
            <AlertTriangle
                className="mx-auto text-red-500"
                size={60}
            />

            <h2 className="text-white text-xl font-bold mt-5">
                Something went wrong
            </h2>

            <p className="text-red-300 mt-3">
                {message}
            </p>

            <button
                onClick={retry}
                className="mt-6 bg-red-600 px-5 py-3 rounded-xl text-white"
            >
                Retry
            </button>
        </div>
    );
}