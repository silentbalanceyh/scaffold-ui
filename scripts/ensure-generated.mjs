import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {spawnSync} from "node:child_process";

const cwd = process.cwd();
const generatedFiles = [
    "src/index.js",
    "src/environment/routes.js",
    "src/environment/datum.js",
    "src/container/index.js",
    "src/components/index.js",
];
const candidateScripts = [
    "scripts/zrun-generate.sh",
    "scripts/run-init.sh",
    "run-init.sh",
];

const existingGenerated = generatedFiles.filter((file) => fs.existsSync(path.join(cwd, file)));
const missingGenerated = generatedFiles.filter((file) => !fs.existsSync(path.join(cwd, file)));

if (missingGenerated.length === 0) {
    console.log("[vite] generated runtime detected");
    process.exit(0);
}

const generator = candidateScripts.find((file) => fs.existsSync(path.join(cwd, file)));

if (!generator) {
    console.warn("[vite] no route/runtime generator script found");
    console.warn(`[vite] missing generated files:\n- ${missingGenerated.join("\n- ")}`);
    if (existingGenerated.length > 0) {
        console.warn(`[vite] existing generated files:\n- ${existingGenerated.join("\n- ")}`);
    }
    process.exit(0);
}

console.log(`[vite] running generator: ${generator}`);
const result = spawnSync("sh", [generator], {
    cwd,
    stdio: "inherit",
});

if (result.status !== 0) {
    process.exit(result.status ?? 1);
}

const remainingMissing = generatedFiles.filter((file) => !fs.existsSync(path.join(cwd, file)));
if (remainingMissing.length > 0) {
    console.warn("[vite] generator completed, but some generated files are still missing");
    console.warn(`[vite] remaining missing files:\n- ${remainingMissing.join("\n- ")}`);
    process.exit(0);
}

console.log("[vite] generated runtime refreshed");
