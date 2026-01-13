import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  plugins: [
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    {
      name: "tanstack-start-head-scripts-placeholder",
      resolveId(id) {
        if (id === "tanstack-start-injected-head-scripts:v") {
          return id;
        }
      },
      load(id) {
        if (id === "tanstack-start-injected-head-scripts:v") {
          // Default to no injected head scripts in dev when the virtual module is missing.
          return 'export const injectedHeadScripts = "";';
        }
      },
    },
    devtools(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    viteReact(),
  ],
});

export default config;
