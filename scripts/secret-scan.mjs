#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const stagedOnly = process.argv.includes("--staged");
const ignored = /(^|\/)(node_modules|dist|coverage|\.git)(\/|$)|\.(lock|map)$/;
const patterns = [
  { name: "OpenAI / OpenRouter-style key", regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { name: "Speechify-style key", regex: /\bsk_e[A-Za-z0-9]{20,}\b/g },
  { name: "xAI-style key", regex: /\bxai-[A-Za-z0-9_-]{20,}\b/g },
  { name: "Bearer credential", regex: /\bBearer\s+[A-Za-z0-9._-]{24,}\b/gi },
  { name: "Hard-coded API key assignment", regex: /\b(?:api[_-]?key|token|secret)\s*[:=]\s*["'`][^"'`\n]{16,}["'`]/gi },
  { name: "Private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

function runGit(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function fileList() {
  if (stagedOnly) return runGit(["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]).split("\0").filter(Boolean);
  return runGit(["ls-files", "-z"]).split("\0").filter(Boolean);
}

const findings = [];
for (const file of fileList()) {
  if (ignored.test(file)) continue;
  let content;
  try {
    content = stagedOnly ? runGit(["show", `:${file}`]) : readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (content.includes("DEMO_KEY") || content.includes("YOUR_API_KEY") || content.includes("<YOUR_")) continue;
  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    if (pattern.regex.test(content)) findings.push(`${file}: ${pattern.name}`);
  }
}

if (findings.length) {
  console.error("\nSecret scan failed. Remove credentials before committing:\n");
  for (const finding of [...new Set(findings)]) console.error(`- ${finding}`);
  console.error("\nUse environment variables and server-side secrets instead.\n");
  process.exit(1);
}
console.log(`Secret scan passed (${stagedOnly ? "staged files" : "tracked files"}).`);
