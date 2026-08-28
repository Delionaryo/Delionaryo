import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                paymentCenter: resolve(__dirname, 'payment-center.html'),
            },
            maxParallelFileOps: 128,
        },
    },
});
