// @ts-check
import { defineConfig } from "astro/config";
import minifyId from "astro-id-minifier";

export default defineConfig({
  integrations: [minifyId()],
  build: {
    inlineStylesheets: "never",
  },
});
