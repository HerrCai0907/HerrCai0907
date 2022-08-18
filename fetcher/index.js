import { fetchFromGithub } from "./fetcher.js";
import { record } from "./recorder.js";
import { top } from "./analysis.js";
import { draw } from "./draw.js";

await fetchFromGithub(record);
draw(top(5));
