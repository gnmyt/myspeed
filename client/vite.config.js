import react from '@vitejs/plugin-react'
import path from "path";
import {VitePWA} from "vite-plugin-pwa";

export default {
    plugins: [
        VitePWA({ injectRegister: 'auto', manifest: false }),
        react()
    ],
    build: {
        outDir: 'build'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            "/api": "http://localhost:5216/"
        }
    }
}