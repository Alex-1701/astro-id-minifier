// @ts-check
import { defineConfig } from "astro/config";
import minifyId from "astro-id-minifier";
import distAnalyzer from "dist-analyzer";

export default defineConfig({
  integrations: [distAnalyzer(), minifyId({ mode: "maximum" }), distAnalyzer()],
  build: {
    inlineStylesheets: "never",
  },
});
