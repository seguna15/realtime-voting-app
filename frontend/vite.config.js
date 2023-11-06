import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import pluginRewriteAll from "vite-plugin-rewrite-all";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://realtime-voting.onrender.com/",
        secure: false,
      },
    },
  },
  plugins: [react(), pluginRewriteAll()],
});
