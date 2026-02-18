import fs from "fs";
import path from "path";

const forbiddenHex = /#([0-9a-fA-F]{3,6})/g;
const forbiddenRgb = /rgb(a)?\(/g;

const scanExtensions = [".ts", ".tsx", ".js", ".jsx"];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!fullPath.includes("node_modules")) {
        scanDir(fullPath);
      }
    } else if (scanExtensions.includes(path.extname(entry.name))) {
      const content = fs.readFileSync(fullPath, "utf8");

      if (forbiddenHex.test(content) || forbiddenRgb.test(content)) {
        console.error(`❌ Hardcoded color found in: ${fullPath}`);
        process.exit(1);
      }
    }
  }
}

scanDir("./app");
scanDir("./components");

console.log("✓ Token validation passed");
