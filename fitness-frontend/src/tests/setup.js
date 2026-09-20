import "@testing-library/jest-dom";

import { afterEach } from "vitest";

import { cleanup } from "@testing-library/react";

afterEach(() => {
    cleanup();
});

if (typeof window !== "undefined") {
    window.matchMedia =
        window.matchMedia ||
        ((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }));

    window.ResizeObserver =
        window.ResizeObserver ||
        class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        };

    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: window.matchMedia,
    });

    Object.defineProperty(navigator, "onLine", {
        configurable: true,
        value: true,
    });
}

globalThis.ResizeObserver = window.ResizeObserver;