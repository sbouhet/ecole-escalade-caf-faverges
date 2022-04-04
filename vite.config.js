import { svelte } from "@sveltejs/vite-plugin-svelte"
import routify from "@roxi/routify/vite-plugin"
import { defineConfig } from "vite"
import { mdsvex } from "mdsvex"
import path from "path"

const production = process.env.NODE_ENV === "production"

export default defineConfig({
  resolve: {
    alias: {
      $components: path.resolve("./src/components"),
      $utils: path.resolve("./src/utilities"),
    },
  },

  clearScreen: false,

  plugins: [
    routify({
      devHelper: !production,
    }),
    svelte({
      emitCss: false,
      compilerOptions: {
        dev: !production,
      },
      extensions: [".md", ".svelte"],
      preprocess: [mdsvex({ extension: "md" })],
    }),
  ],

  server: { port: 1337 },
})
