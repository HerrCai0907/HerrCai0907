import { Octokit } from "@octokit/core";
import { env } from "process";
import languages from "linguist-languages";
import { basename, extname } from "path";

const ignoreLanguages = ["WebAssembly", "JSON"];

function prepareQuery() {
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return encodeURIComponent(`author:HerrCai0907 -repo:HerrCai0907/HerrCai0907 committer-date:>${startDate.toISOString()}`);
}

const result = {};
const languageOverwritten = {
  "GCC Machine Description": "Markdown",
}

const ignoredExtensions = [
  ".txt",
]

function statistic(file, lines) {
  const ext = extname(file);
  (() => {
    if (ignoredExtensions.includes(ext)) return;
    let fileLanguage = null;
    for (let lang of Object.keys(languages)) {
      if (!languages[lang].color) continue;
      if (languages[lang].extensions?.includes(ext)) {
        if (fileLanguage == null || languageOverwritten[fileLanguage] == lang) {
          fileLanguage = lang;
        }
      }
      if (languages[lang].filenames?.includes(basename(file))) {
        if (fileLanguage == null || languageOverwritten[fileLanguage] == lang) {
          fileLanguage = lang;
        }
      }
    }
    if (fileLanguage != null) {
      result[fileLanguage] = result[fileLanguage] ?? 0;
      result[fileLanguage] += lines;
      console.log(`add '${fileLanguage}' ${lines} lines due to '${file}'`);
    }
  })();
}

export async function fetchFromGithub() {
  const octokit = new Octokit({
    auth: env["TOKEN"],
  });

  const request = `GET /search/commits?q=${prepareQuery()}`;

  console.log(`fetch ${request}`);
  const hashes = new Set();

  for (let pageIndex = 0; ; pageIndex++) {
    const {
      data: { items },
    } = await octokit.request(request, {
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
      per_page: 100,
      page: pageIndex,
    });

    if (items.length == 0) {
      break;
    }
    await Promise.all(
      items.map(async (item) => {
        if (hashes.has(item.sha)) {
          return;
        }
        hashes.add(item.sha);
        console.log(`fetch ${item.url}`);
        const { data } = await octokit.request(item.url);
        data.files.forEach((file) => {
          statistic(file.filename, file.changes);
        });
      })
    );
  }
  for (let lang of ignoreLanguages) {
    delete result[lang];
  }
  return result;
}
