#!/usr/bin/env node
/**
 * Push local `.env.local` files to Vercel for all apps that have a linked project.
 *
 * This script is intentionally "local-first": `.env.local` files are usually gitignored,
 * so the script is meant to be run on your machine (not CI) after `vercel link`.
 *
 * Usage:
 *   pnpm vercel:env:push --env development
 *   pnpm vercel:env:push --env preview --apps marketing,studio
 *
 * Requirements:
 *   - pnpm installed
 *   - Vercel project linked in each app directory (`.vercel/project.json` exists)
 *   - network access (pnpm dlx will download vercel-env-push on first run)
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const VALID_ENVS = new Set(["development", "preview", "production"]);

function parseArgs(argv) {
  const args = {
    env: "development",
    apps: null, // null => all
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--env") {
      args.env = argv[i + 1];
      i += 1;
      continue;
    }
    if (a === "--apps") {
      const raw = argv[i + 1] ?? "";
      args.apps = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
  }

  return args;
}

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function run(cmd, cmdArgs, opts) {
  const res = spawnSync(cmd, cmdArgs, {
    stdio: "inherit",
    ...opts,
  });
  return res.status ?? 1;
}

function main() {
  const { env, apps } = parseArgs(process.argv.slice(2));

  if (!VALID_ENVS.has(env)) {
    console.error(
      `Invalid --env "${env}". Expected one of: ${Array.from(VALID_ENVS).join(
        ", "
      )}`
    );
    process.exit(1);
  }

  const repoRoot = process.cwd();

  const candidates = [
    { name: "marketing", dir: path.join(repoRoot, "apps", "marketing") },
    { name: "studio", dir: path.join(repoRoot, "apps", "studio") },
  ];

  const targets =
    apps?.length > 0
      ? candidates.filter((c) => apps.includes(c.name))
      : candidates;

  if (targets.length === 0) {
    console.error(
      `No matching apps found. Known apps: ${candidates
        .map((c) => c.name)
        .join(", ")}`
    );
    process.exit(1);
  }

  let hadAny = false;
  let anyFailed = false;

  for (const t of targets) {
    const envFile = path.join(t.dir, ".env.local");
    const vercelLinkFile = path.join(t.dir, ".vercel", "project.json");

    if (!exists(t.dir)) {
      console.log(`[skip] ${t.name}: directory not found (${t.dir})`);
      continue;
    }

    if (!exists(envFile)) {
      console.log(`[skip] ${t.name}: no .env.local found`);
      continue;
    }

    if (!exists(vercelLinkFile)) {
      console.log(
        `[skip] ${t.name}: not linked to Vercel (missing .vercel/project.json). Run: (cd ${path.relative(
          repoRoot,
          t.dir
        )} && vercel link)`
      );
      continue;
    }

    hadAny = true;
    console.log(`\n=== Pushing ${t.name} .env.local → Vercel (${env}) ===\n`);

    // Uses pnpm dlx so we don't permanently add a dependency.
    // vercel-env-push will use the local `.vercel/project.json` to target the correct project.
    const status = run(
      "pnpm",
      ["dlx", "vercel-env-push", ".env.local", env],
      { cwd: t.dir }
    );

    if (status !== 0) {
      anyFailed = true;
      console.log(`\n[fail] ${t.name} env push exited with code ${status}\n`);
    }
  }

  if (!hadAny) {
    console.log(
      [
        "No env files were pushed.",
        "Make sure each app has:",
        "- a `.env.local` file",
        "- a linked Vercel project (`vercel link` creates `.vercel/project.json`)",
      ].join("\n")
    );
    process.exit(1);
  }

  if (anyFailed) {
    process.exit(1);
  }
}

main();


