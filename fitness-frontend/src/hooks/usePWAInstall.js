import { useEffect, useState } from "react";

export default function usePWAInstall() {
    const [canInstall, setCanInstall] = useState(false);
    const [promptEvent, setPromptEvent] = useState(null);

    useEffect(() => {
        const handler = (event) => {
            event.preventDefault();
            setPromptEvent(event);
            setCanInstall(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const install = async () => {
        if (!promptEvent) return;

        promptEvent.prompt();

        await promptEvent.userChoice;

        setCanInstall(false);
    };

    return { install, canInstall };
}