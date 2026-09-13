import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";
import OfflineBanner from "../common/OfflineBanner";

export default function PageLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-[color:var(--background)] min-h-screen flex">
            <Sidebar />

            <MobileSidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar setSidebarOpen={setSidebarOpen} />

                <OfflineBanner />

                <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}