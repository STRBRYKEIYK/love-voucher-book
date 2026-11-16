import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from /date/ inside the love-voucher-book repo; the build is committed to ../love-voucher-book/date
export default defineConfig({
  base: "/date/",
  plugins: [react()],
  build: { outDir: process.env.OUT_DIR || "dist", emptyOutDir: true }
});
