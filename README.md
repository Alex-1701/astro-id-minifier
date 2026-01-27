# Minify Astro Id

Plugin for [Astro.js](https://astro.build/) to minify Astro custom data attributes.

> [!NOTE]
> This only works for static exports, SSR does not export assets that can be compressed ahead of time.

Astro uses custom data attributes for matching styles with elements. And in some cases this attributes could take up to 15% of HTML file size. We can safely minify this attributes for production build by replacing them in all HTML and CSS files in `dist` folder.

Astro produces boolean data attribute 23 or 30 bytes:

- 30 bytes `data-astro-cid-3y67xlrp="true"`
- 23 bytes `data-astro-cid-3y67xlrp`

1. `prefix` mode - safe variant. In best case 6 bytes `data-0`
2. `maximum` mode - unsafe alternative. W3C validator will be unhappy because of non standard attribute names. Best case is 1 byte `a`

Replacement example:

| original                  | `prefix` mode | `maximum` mode |
| :------------------------ | :------------ | :------------- |
| `data-astro-cid-a19vuypl` | `data-0`      | `a`            |
| `data-astro-cid-c6n81xn6` | `data-1`      | `b`            |
| `data-astro-cid-2il9dovh` | `data-2`      | `c`            |
| ...                       | ...           | ...            |
| `data-astro-cid-awafihhf` | `data-1b`     | `al`           |
| `data-astro-cid-7bzp6f8c` | `data-1c`     | `am`           |
| `data-astro-cid-6l5jns9d` | `data-1d`     | `an`           |

# Installation

While this plugin not uploaded to NPM you can install it directly from this repo

```sh
npm i github:Alex-1701/astro-id-minifier
```

# Usage

Add plugin to `astro.config.mjs` config

```js
// @ts-check
import { defineConfig } from "astro/config";
import minifyAstroId from "astro-id-minifier";

export default defineConfig({
  integrations: [minifyAstroId()],
});
```

# Settings

| param   | default  | description                                                                                                                                           |
| ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| mode    | `prefix` | Type of resulting attribute                                                                                                                           |
| exclude | `[]`     | List of attributes that should be skipped. Standard 2 and 3 letters attributes already skipped. Use it to avoid collision with your custom attribute. |
