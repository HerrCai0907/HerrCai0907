import { record } from "./recorder.js";
import languages from "linguist-languages";

export function top(num) {
  let sum = 0;
  let data = [];
  for (const lang in record.info) {
    const line = record.info[lang];
    sum += line;
  }
  for (const lang in record.info) {
    const line = record.info[lang];
    data.push({ lang, rate: (line / sum) * 100, color: languages[lang].color });
  }
  data.sort((a, b) => b.rate - a.rate);

  console.log("statistic result :\n", data);

  return data.slice(0, num);
}
