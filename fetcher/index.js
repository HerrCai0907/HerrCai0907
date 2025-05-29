import { fetchFromGithub } from "./fetcher.js";
import { top } from "./analysis.js";
import { draw } from "./draw.js";

draw(top(await fetchFromGithub(), 5));
