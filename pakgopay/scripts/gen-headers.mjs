import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = "dist";
const file = resolve(OUT_DIR, "_headers");

const content = `
/assets/*
  Access-Control-Allow-Origin: https://wanwanpay.com
  Access-Control-Allow-Methods: GET, HEAD, OPTIONS
  Access-Control-Allow-Headers: *
`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(file, content.trimStart(), "utf8");
console.log("Generated", file);
