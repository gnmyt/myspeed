import react from '@vitejs/plugin-react'
import path from "path";

export default {
    plugins: [react()],
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