import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// https://vitejs.dev/guide/build.html#browser-compatibility
export default defineConfig({
    plugins: [react()],
});
