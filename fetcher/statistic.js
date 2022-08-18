import languages from "linguist-languages";
import { extname } from "path";
import { record } from "./recorder.js";

const targetLanguages = ["C++", "C", "TypeScript", "JavaScript", "Rust", "Python", "Markdown", "reStructuredText"];

export function statistic(file, lines) {
  const ext = extname(file);
  for (let lang of targetLanguages) {
    if (languages[lang].extensions?.includes(ext)) {
      record.info[lang] = record.info[lang] ?? 0;
      record.info[lang] += lines;
      console.log(`add '${lang}' ${lines} lines due to '${file}'`);
      break;
    }
  }
}
