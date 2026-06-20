import { readFileSync } from "node:fs";
import path from "node:path";

type Locale = "zh";

const sourceFiles: Record<Locale, string> = {
  zh: "index.html"
};

export function getPrototypeBody(locale: Locale) {
  const filePath = path.join(
    process.cwd(),
    "outputs",
    "companion-studio-prototype",
    sourceFiles[locale]
  );
  const html = readFileSync(filePath, "utf8");
  const body = html.match(/<body>([\s\S]*?)<\/body>/)?.[1] ?? "";

  return body
    .replace(/<script src="app\.js"><\/script>/, "")
    .replaceAll('href="index.html"', 'href="/"');
}
