import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "node_modules/.vite/aisz-framework");
const manifestPath = path.join(outDir, "manifest.json");
const viteBin = path.join(projectRoot, "node_modules/vite/bin/vite.js");

const FRAMEWORK_DIRS = [
    {alias: "env-icon", srcDir: "src/environment/icon"},
    {alias: "lang", srcDir: "src/cab"},
    {alias: "entity", srcDir: "src/entity@em"},
    {alias: "skin", srcDir: "src/skin"},
    {alias: "ui", srcDir: "src/ui"},
    {alias: "ux", srcDir: "src/ux"},
    {alias: "oi", srcDir: "src/extension/eclat"},
    {alias: "ei", srcDir: "src/extension/ecosystem"},
    {alias: "ex", srcDir: "src/extension/library"},
    {alias: "zei", srcDir: "src/unfold"},
    {alias: "zep", srcDir: "src/upper"},
    {alias: "utils", srcDir: "src/utils"},
    {alias: "zet", srcDir: "src/utter"},
    {alias: "zero", srcDir: "src/zero"},
    {alias: "zi", srcDir: "src/zion"},
    {alias: "zmr", srcDir: "src/zither@em"},
    {alias: "zo", srcDir: "src/zodiac"},
    {alias: "zme", srcDir: "src/zoe@em"},
    {alias: "zone", srcDir: "src/zone"},
];

const resolveEntry = (dirPath) => {
    const candidates = [
        path.join(dirPath, "index.js"),
        path.join(dirPath, "index.jsx"),
        path.join(dirPath, "index.ts"),
        path.join(dirPath, "index.tsx"),
        path.join(dirPath, "in.entry.js"),
        path.join(dirPath, "in.entry.jsx"),
    ];
    return candidates.find((candidate) => fs.existsSync(candidate)) || null;
};

const fingerprintDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) return "missing";
    const items = [];
    const walk = (current) => {
        const entries = fs.readdirSync(current, {withFileTypes: true});
        for (const entry of entries) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === "node_modules") continue;
                walk(full);
            } else {
                const stat = fs.statSync(full);
                items.push(`${path.relative(projectRoot, full)}:${stat.mtimeMs}`);
            }
        }
    };
    walk(dirPath);
    return items.sort().join("|");
};

const readManifest = () => {
    try {
        return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch {
        return {};
    }
};

const writeManifest = (manifest) => {
    fs.mkdirSync(outDir, {recursive: true});
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
};

const buildAlias = (alias, entry) => {
    const outputFile = path.join(outDir, `${alias}.js`);
    const outputDir = path.dirname(outputFile);
    fs.mkdirSync(outputDir, {recursive: true});

    const result = spawnSync(process.execPath, [
        viteBin,
        "build",
        "--config",
        "vite.config.mjs",
        "--mode",
        "development",
    ], {
        cwd: projectRoot,
        stdio: "pipe",
        env: {
            ...process.env,
            AISZ_PREBUNDLE_BUILD: "true",
            AISZ_PREBUNDLE_ENTRY: path.relative(projectRoot, entry),
            AISZ_PREBUNDLE_FILE: alias,
            AISZ_PREBUNDLE_ALIAS: alias,
            NODE_ENV: "development",
            GENERATE_SOURCEMAP: "true",
        },
        encoding: "utf8",
    });

    if (result.status !== 0) {
        return {
            ok: false,
            error: (result.stderr || result.stdout || "vite build failed").trim(),
        };
    }

    const builtFile = path.join(outDir, `${alias}.js`);
    const builtMap = path.join(outDir, `${alias}.js.map`);
    if (!fs.existsSync(builtFile)) {
        return {ok: false, error: `missing output ${builtFile}`};
    }
    if (!fs.existsSync(builtMap)) {
        return {ok: false, error: `missing sourcemap ${builtMap}`};
    }
    return {ok: true};
};

const main = () => {
    if (!fs.existsSync(viteBin)) {
        console.error("[prebundle] vite binary not found");
        process.exit(1);
    }

    const manifest = readManifest();
    const updated = [];
    const skipped = [];
    const failed = [];

    for (const {alias, srcDir} of FRAMEWORK_DIRS) {
        const absDir = path.join(projectRoot, srcDir);
        if (!fs.existsSync(absDir)) {
            skipped.push(`${alias}(missing)`);
            continue;
        }

        const entry = resolveEntry(absDir);
        if (!entry) {
            skipped.push(`${alias}(no-entry)`);
            continue;
        }

        const fingerprint = fingerprintDir(absDir);
        const cached = manifest[alias];
        const outputFile = path.join(outDir, `${alias}.js`);
        const outputMap = path.join(outDir, `${alias}.js.map`);

        if (
            cached &&
            cached.fingerprint === fingerprint &&
            fs.existsSync(outputFile) &&
            fs.existsSync(outputMap)
        ) {
            skipped.push(alias);
            continue;
        }

        process.stdout.write(`[prebundle] building ${alias}... `);
        const result = buildAlias(alias, entry);
        if (result.ok) {
            manifest[alias] = {
                fingerprint,
                builtAt: Date.now(),
                srcDir,
                entry: path.relative(projectRoot, entry),
            };
            updated.push(alias);
            process.stdout.write("done\n");
        } else {
            failed.push({alias, error: result.error});
            process.stdout.write("failed\n");
        }
    }

    writeManifest(manifest);

    console.log(`[prebundle] summary updated=${updated.length}, skipped=${skipped.length}, failed=${failed.length}`);
    if (updated.length) {
        console.log(`[prebundle] updated: ${updated.join(", ")}`);
    }
    if (failed.length) {
        failed.forEach((item) => {
            console.error(`[prebundle] ${item.alias} error:\n${item.error}\n`);
        });
        process.exit(1);
    }
};

main();
