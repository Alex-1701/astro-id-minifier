# Astro Id Minifier

Plugin for [Astro.js](https://astro.build/) to minify Astro custom data attributes and reduce build size.

> [!NOTE]
> This only works for static exports, SSR does not export assets that can be compressed ahead of time.

Astro uses custom data attributes for matching styles with elements. It consist of prefix `data-astro-cid-` and random 8 symbols for uniqueness (lets say it is radix 36 number). And in some cases this attributes could take up to 15% of HTML file size. We can safely replace this attributes with shorter alternative in all HTML and CSS files and reduce bundle size.

You can choose from two possible options of minification:

1. `prefix` mode - Produces valid data attributes with base 36 number as uid. In best cases 6 symbols length (`data-0` ... `data-z`)
2. `maximum` mode - Uses base 36 number as attribute. W3C validator will be unhappy because of non standard attribute names. In best cases 1 symbol length (`a`... `z`)

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

```sh
npm i astro-id-minifier
```

# Usage

Add plugin to `astro.config.*` file under `integrations` property:

```js
// @ts-check
import { defineConfig } from "astro/config";
import minifyId from "astro-id-minifier";

export default defineConfig({
  integrations: [minifyId()],
});
```

# Settings

| param   | default  | description                                                                                                                                           |
| ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| mode    | `prefix` | Type of resulting attribute                                                                                                                           |
| exclude | `[]`     | List of attributes that should be skipped. Standard 2 and 3 letters attributes already skipped. Use it to avoid collision with your custom attribute. |

# Example

Let's check how it works!

Before minification:

| type | amount |  size |   size\* |
| :--- | -----: | ----: | -------: |
| HTML |      5 | 17753 | 17.75 kB |
| CSS  |      8 |  7110 |  7.11 kB |
| SVG  |      1 |   749 |    749 B |
| ICO  |      1 |   655 |    655 B |
| ...  |     15 | 26267 | 26.27 kB |

After minification:

| type | amount |  size |   size\* |
| :--- | -----: | ----: | -------: |
| HTML |      5 | 13656 | 13.66 kB |
| CSS  |      8 |  5478 |  5.48 kB |
| SVG  |      1 |   749 |    749 B |
| ICO  |      1 |   655 |    655 B |
| ...  |     15 | 20538 | 20.54 kB |

5.7 kB out of 26.27 kB saved!
