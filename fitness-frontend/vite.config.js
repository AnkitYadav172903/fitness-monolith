/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),

        process.env.ANALYZE &&
            visualizer({
                open: true,
                gzipSize: true,
                filename: "dist/stats.html",
            }),

        VitePWA({
            registerType: "autoUpdate",

            includeAssets: ["favicon.ico", "favicon.svg", "logo.svg"],

            manifest: {
                name: "Fitness Monolith",
                short_name: "Fitness",
                description: "Fitness Tracking Web Application",

                theme_color: "#2563EB",
                background_color: "#020617",

                display: "standalone",
                orientation: "portrait",

                start_url: "/",
                scope: "/",

                icons: [
                    {
                        src: "/icons/icon-192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/icons/maskable-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },

            workbox: {
                globPatterns: [
                    "**/*.{js,css,html,svg,png,ico,json,webmanifest}",
                ],
                navigateFallback: "/offline.html",
                navigateFallbackDenylist: [/^\/api\//],
                cleanupOutdatedCaches: true,
            },
        }),
    ],

    resolve: {
        dedupe: ["react", "react-dom"],
    },

    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/tests/setup.js"],
    },
});