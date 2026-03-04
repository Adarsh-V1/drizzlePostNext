import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const envExample = readFileSync(new URL("../.env.example", import.meta.url), "utf8");

test("quality scripts exist", () => {
  assert.equal(typeof packageJson.scripts.lint, "string");
  assert.equal(typeof packageJson.scripts.typecheck, "string");
  assert.equal(typeof packageJson.scripts.build, "string");
  assert.equal(typeof packageJson.scripts.test, "string");
});

test(".env.example documents required keys", () => {
  const required = ["DATABASE_URL", "NEXT_PUBLIC_APP_URL", "CORS_ORIGIN", "API_MAX_USERS_LIMIT"];

  for (const key of required) {
    assert.equal(envExample.includes(`${key}=`), true, `${key} must be present in .env.example`);
  }
});
