import type { AstroIntegration } from "astro";

interface Config {
  excludedNames?: string[];
  mode?: "prefix" | "maximum";
}

export default function (config?: Config): AstroIntegration;
