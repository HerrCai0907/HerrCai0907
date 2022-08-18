import { existsSync, readFileSync } from "fs";

export const history = existsSync("fetcher/lang.svg")
  ? JSON.parse(
      readFileSync("fetcher/lang.svg", { encoding: "utf8" })
        .split("\n", 1)[0]
        .slice("<!--".length, 0 - "-->".length)
    )
  : {};

export const record = {
  info: history.info ?? {},
};
