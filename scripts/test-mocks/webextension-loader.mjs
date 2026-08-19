import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const mockUrl = new URL("./webextension-polyfill.mjs", import.meta.url).href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "webextension-polyfill") {
    return { url: mockUrl, shortCircuit: true };
  }

  if (specifier.startsWith(".") && context.parentURL) {
    const typeScriptUrl = new URL(`${specifier}.ts`, context.parentURL);
    if (existsSync(fileURLToPath(typeScriptUrl))) {
      return { url: typeScriptUrl.href, shortCircuit: true };
    }

    const indexUrl = new URL(`${specifier}/index.ts`, context.parentURL);
    if (existsSync(fileURLToPath(indexUrl))) {
      return { url: indexUrl.href, shortCircuit: true };
    }
  }

  return nextResolve(specifier, context);
}
