const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const path = require("node:path");

test("page-flip dependency patch can run repeatedly", () => {
  const script = path.resolve(__dirname, "..", "scripts", "patch-react-pageflip-enhanced.cjs");

  assert.doesNotThrow(() => {
    execFileSync(process.execPath, [script], { stdio: "pipe" });
    execFileSync(process.execPath, [script], { stdio: "pipe" });
  });
});
