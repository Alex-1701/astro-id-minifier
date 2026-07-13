import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { glob } from "tinyglobby";

// Standard 2 and 3 letter attributes.
const STANDARD_ATTRIBUTES = ["as", "id", "alt", "csp", "dir", "src", "for"];

const count = (array, value) => {
  return array.filter((x) => x === value).length;
};

const getAllIds = async (files) => {
  const allIds = [];

  for (const file of files) {
    const fileContent = await fs.readFile(file, "utf-8");
    const selected = fileContent.match(/(data-astro-cid-)(\w*)/gm);
    if (selected) {
      allIds.push(...selected);
    }
  }

  return allIds;
};

export const minifyIds = (ids, excludedNames, mode) => {
  const minified = new Map();

  if (mode === "conservative") {
    for (let i = 0; i < ids.length; i++) {
      minified.set(ids[i].value, ids[i].value.replaceAll("-astro-cid-", "-"));
    }
    return minified;
  }

  if (mode === "prefix") {
    let counter = 0;
    for (let i = 0; i < ids.length; i++) {
      let suggestedToSet = `data-${counter.toString(36)}`;
      while (excludedNames.includes(suggestedToSet)) {
        counter++;
        suggestedToSet = `data-${counter.toString(36)}`;
      }
      minified.set(ids[i].value, suggestedToSet);
      counter++;
    }

    return minified;
  }

  if (mode === "maximum") {
    const excludedIds = [...STANDARD_ATTRIBUTES, ...excludedNames];
    let index = 0;

    ids.forEach((id) => {
      if (!isNaN(Number(index.toString(36)[0]))) {
        // jump to closest safe value
        const power = index.toString(36).length;
        const zeroes = "0".repeat(power - 1);
        index = parseInt(`a${zeroes}`, 36);
      }

      let suggestedToSet = index.toString(36);
      while (excludedIds.includes(suggestedToSet)) {
        index++;
        suggestedToSet = index.toString(36);
      }

      minified.set(id.value, suggestedToSet);
      index++;
    });

    return minified;
  }
};

const replaceOriginalIds = async (files, ids) => {
  for (const file of files) {
    let fileContent = await fs.readFile(file, "utf-8");

    ids.forEach((shortId, fullId) => {
      fileContent = fileContent.replaceAll(`${fullId}="true"`, shortId);
      fileContent = fileContent.replaceAll(fullId, shortId);
    });

    await fs.writeFile(file, fileContent);
  }
};

const selectUniquieValues = (array) => {
  const set = new Set(array);
  const res = [];
  set.forEach((value) => {
    res.push({ value, count: count(array, value) });
  });
  return res;
};

const sortByFrequency = (array) => {
  return array.toSorted((a, b) => b.count - a.count);
};

async function main({ excludedNames, mode, outDir }) {
  const files = (
    await glob(["**/*.html", "**/*.css"], {
      cwd: outDir,
    })
  ).map((file) => `${outDir}${file}`);

  const allIds = await getAllIds(files);
  const uniqueIds = selectUniquieValues(allIds);
  const uniqueSortedIds = sortByFrequency(uniqueIds);
  const minifiedIds = minifyIds(uniqueSortedIds, excludedNames, mode);
  await replaceOriginalIds(files, minifiedIds);
}

export default function minifyId(config) {
  const defaultConfig = {
    excludedNames: [],
    mode: "prefix",
  };

  return {
    name: "astro-id-minifier",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const path = fileURLToPath(dir);
        await main({ ...defaultConfig, ...config, outDir: path });
        logger.info("id minification complete\n");
      },
    },
  };
}
