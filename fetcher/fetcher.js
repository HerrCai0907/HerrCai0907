import { Octokit } from "@octokit/core";
import { statistic } from "./statistic.js";
import { record, history } from "./recorder.js";
import { env } from "process";

const orgs = ["assemblyscript", "Schleifner", "nodejs", "WebAssembly", "MaaAssistantArknights"];
const repos = ["llvm/llvm-project"];

function prepareQuery() {
  const projectRanges = orgs.map((v) => `org:${v}`).join(" ") + " " + repos.map((v) => `repo:${v}`).join(" ");

  const dateRange = history.startDate === undefined ? "" : `committer-date:>${history.startDate}`;
  record.startDate = new Date(Date.now()).toISOString();

  return encodeURIComponent(`author:HerrCai0907 ${projectRanges} ${dateRange}`);
}

export async function fetchFromGithub() {
  const octokit = new Octokit({
    auth: env["TOKEN"],
  });

  const request = `GET /search/commits?q=${prepareQuery()}`;

  console.log(`fetch ${request}`);

  for (let pageIndex = 1; ; pageIndex++) {
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
}
