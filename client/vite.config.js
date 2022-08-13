import react from '@vitejs/plugin-react'

export default {
    plugins: [react()],
    build: {
        outDir: 'build'
    },
    server: {
        proxy: {
            "/api": "http://localhost:5216/"
        }
    }
}