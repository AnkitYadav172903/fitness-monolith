import { WifiOff } from "lucide-react";
import useNetworkStatus from "../../hooks/useNetworkStatus";

export default function OfflineBanner() {
    const online = useNetworkStatus();

    if (online) return null;

    return (
        <div className="bg-orange-600 text-center p-3 text-white flex items-center justify-center gap-2 sticky top-[64px] z-40">
            <WifiOff size={16} />
            Offline Mode Enabled — Showing Cached Data
        </div>
    );
}