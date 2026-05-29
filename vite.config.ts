import crypto from "crypto";
if (!("hash" in crypto)) {
  (crypto as any).hash = (algo: string, data: import("crypto").BinaryLike, enc: import("crypto").BinaryToTextEncoding = "hex") => 
    crypto.createHash(algo).update(data as any).digest(enc);
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
