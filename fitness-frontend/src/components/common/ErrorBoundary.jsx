import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex justify-center items-center bg-[color:var(--background)] text-[color:var(--text)] p-6">
                    <div className="surface border border-theme rounded-3xl p-10 text-center max-w-md">
                        <h1 className="text-5xl font-bold text-red-500">
                            Oops!
                        </h1>

                        <p className="mt-4 text-[color:var(--text-secondary)]">
                            Something went wrong. Your fitness data is safe,
                            just reload the application.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl text-white"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}