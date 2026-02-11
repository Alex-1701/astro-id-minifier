// @ts-check
import { defineConfig } from "astro/config";
import minifyId from "astro-id-minifier";
import distAnalyzer from "dist-analyzer";
import compressor from "astro-compressor";

export default defineConfig({
  integrations: [minifyId(), compressor(), distAnalyzer()],
  build: {
    inlineStylesheets: "never",
  },
});
