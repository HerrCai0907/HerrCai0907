import { Octokit } from "@octokit/core";
import { env } from "process";
import languages from "linguist-languages";
import { basename, extname } from "path";

const orgs = ["HerrCai0907", "Schleifner", "assemblyscript", "nodejs", "WebAssembly", "MaaAssistantArknights"];
const repos = ["llvm/llvm-project"];
const ignoreLanguage = ["Webassembly"];

function prepareQuery() {
  const projectRanges = orgs.map((v) => `org:${v}`).join(" ") + " " + repos.map((v) => `repo:${v}`).join(" ");
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return encodeURIComponent(`author:HerrCai0907 ${projectRanges} committer-date:>${startDate.toISOString()}`);
}

const result = {};

function statistic(file, lines) {
  const ext = extname(file);
  (() => {
    for (let lang of Object.keys(languages)) {
      if (ignoreLanguage.includes(lang)) {
        continue;
      }
      if (languages[lang].filenames.includes(basename(file))) {
        result[lang] = result[lang] ?? 0;
        result[lang] += lines;
        console.log(`add '${lang}' ${lines} lines due to '${file}'`);
        return;
      }
    }
    for (let lang of Object.keys(languages)) {
      if (ignoreLanguage.includes(lang)) {
        continue;
      }
      if (languages[lang].extensions?.includes(ext)) {
        result[lang] = result[lang] ?? 0;
        result[lang] += lines;
        console.log(`add '${lang}' ${lines} lines due to '${file}'`);
        return;
      }
    }
  })();
}

export async function fetchFromGithub() {
  const octokit = new Octokit({
    auth: env["TOKEN"],
  });

  const request = `GET /search/commits?q=${prepareQuery()}`;

  console.log(`fetch ${request}`);

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
        console.log(`fetch ${item.url}`);
        const { data } = await octokit.request(item.url);
        data.files.forEach((file) => {
          statistic(file.filename, file.changes);
        });
      })
    );
  }
  return result;
}
