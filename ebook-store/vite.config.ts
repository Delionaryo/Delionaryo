import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({base:'./',build:{rollupOptions:{input:{main:resolve(__dirname,'index.html'),paymentCenter:resolve(__dirname,'payment-center.html'),paymentAdmin:resolve(__dirname,'payment-admin.html'),aiDelionaryoLibrary:resolve(__dirname,'ai-delionaryo-library.html')},maxParallelFileOps:128}}});