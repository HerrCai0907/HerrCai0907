import languages from "linguist-languages";

export function top(info, num) {
  let sum = 0;
  let data = [];
  for (const lang in info) {
    const line = info[lang];
    sum += line;
  }

  console.log("statistic result :\n", info);

  for (const lang in info) {
    const line = info[lang];
    data.push({ lang, rate: (line / sum) * 100, color: languages[lang].color });
  }
  data.sort((a, b) => b.rate - a.rate);

  console.log("statistic result :\n", data);

  return data.slice(0, num);
}
