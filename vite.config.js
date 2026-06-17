import {defineConfig} from 'vite';
import {dirname, resolve} from 'path';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: resolve(__dirname, 'front'),
    publicDir: resolve(__dirname, 'public'),
    server: {
        port: 5173,
        open: false,
        allowedHosts: true,
    },
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'front/main.js'),
            output: {
                entryFileNames: "assets/main.js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name].[ext]"
            },
        },
    },
});
