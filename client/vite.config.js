import react from "@vitejs/plugin-react";
import {VitePWA} from "vite-plugin-pwa";
import path from "path";

export default {
    plugins: [
        VitePWA({injectRegister: "auto", manifest: false}),
        react()
    ],
    build: {
        outDir: "build",
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules'))
                        return id.includes('@fortawesome') ? 'icons' : 'vendor';
                }
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            "/api": "http://localhost:5216/"
        }
    }
}