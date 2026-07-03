import crypto from "crypto";
if (!("hash" in crypto)) {
  (crypto as any).hash = (algo: string, data: import("crypto").BinaryLike, enc: import("crypto").BinaryToTextEncoding = "hex") =>
    crypto.createHash(algo).update(data as any).digest(enc);
}

// @ts-ignore
import ws from "ws";
if (typeof globalThis !== "undefined" && !globalThis.WebSocket) {
  globalThis.WebSocket = (ws as any).default || ws;
}

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
  server: {
    port: 8080,
    strictPort: true,
  },
});
