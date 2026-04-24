import fs from "node:fs";
import path from "node:path";
import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "node_modules/.vite/aisz-framework");
const manifestPath = path.join(outDir, "manifest.json");
const viteBin = path.join(projectRoot, "node_modules/vite/bin/vite.js");

// 并发构建限制（避免内存爆炸）
const MAX_CONCURRENT_BUILD = 4;

// 预打包框架模块（排除需要频繁修改的业务模块，让 HMR 精确追踪）
// 排除列表：zet (src/utter) - 业务代码，需要实时热更新
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
    // {alias: "zet", srcDir: "src/utter"},  // 排除：业务模块，需要 HMR
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

// 优化的 fingerprint 计算：只检查入口文件和最近修改的文件
const fingerprintDirFast = (dirPath) => {
    if (!fs.existsSync(dirPath)) return "missing";
    
    const entry = resolveEntry(dirPath);
    if (!entry) return "no-entry";
    
    // 快速指纹：入口文件 mtime + 目录下最近10个修改文件的 mtime
    const items = [];
    const entryStat = fs.statSync(entry);
    items.push(`entry:${entryStat.mtimeMs}`);
    
    // 收集目录下所有文件，按 mtime 排序取最近的
    const files = [];
    const walk = (current) => {
        const entries = fs.readdirSync(current, {withFileTypes: true});
        for (const entry of entries) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === "node_modules") continue;
                walk(full);
            } else {
                const stat = fs.statSync(full);
                files.push({path: full, mtime: stat.mtimeMs});
            }
        }
    };
    walk(dirPath);
    
    // 取最近修改的10个文件（足够检测变化）
    const recentFiles = files.sort((a, b) => b.mtime - a.mtime).slice(0, 10);
    recentFiles.forEach((f) => items.push(`${path.basename(f.path)}:${f.mtime}`));
    
    return items.join("|");
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

// 异步构建（使用 spawn 而不是 spawnSync）
const buildAliasAsync = (alias, entry) => {
    return new Promise((resolve) => {
        const outputFile = path.join(outDir, `${alias}.js`);
        const outputDir = path.dirname(outputFile);
        fs.mkdirSync(outputDir, {recursive: true});

        const child = spawn(process.execPath, [
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
        });

        let stderr = "";
        let stdout = "";

        child.stderr.on("data", (data) => stderr += data);
        child.stdout.on("data", (data) => stdout += data);

        child.on("close", (code) => {
            if (code !== 0) {
                resolve({
                    ok: false,
                    error: (stderr || stdout || "vite build failed").trim(),
                });
                return;
            }

            const builtFile = path.join(outDir, `${alias}.js`);
            const builtMap = path.join(outDir, `${alias}.js.map`);
            if (!fs.existsSync(builtFile)) {
                resolve({ok: false, error: `missing output ${builtFile}`});
                return;
            }
            if (!fs.existsSync(builtMap)) {
                resolve({ok: false, error: `missing sourcemap ${builtMap}`});
                return;
            }
            resolve({ok: true});
        });

        child.on("error", (err) => {
            resolve({ok: false, error: err.message});
        });
    });
};

// 并发构建队列
const runConcurrentBuilds = async (tasks) => {
    const results = [];
    const executing = [];
    
    for (const task of tasks) {
        const promise = buildAliasAsync(task.alias, task.entry).then((result) => {
            executing.splice(executing.indexOf(promise), 1);
            return {alias: task.alias, result, fingerprint: task.fingerprint, srcDir: task.srcDir, entry: task.entry};
        });
        
        results.push(promise);
        executing.push(promise);
        
        // 达到并发限制，等待一个完成
        if (executing.length >= MAX_CONCURRENT_BUILD) {
            await Promise.race(executing);
        }
    }
    
    return Promise.all(results);
};

const main = async () => {
    if (!fs.existsSync(viteBin)) {
        console.error("[prebundle] vite binary not found");
        process.exit(1);
    }

    const manifest = readManifest();
    const buildTasks = [];
    const skipped = [];

    // 第一阶段：收集需要构建的任务（快速检查）
    console.log("[prebundle] scanning modules...");
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

        const fingerprint = fingerprintDirFast(absDir);
        const cached = manifest[alias];
        const outputFile = path.join(outDir, `${alias}.js`);
        const outputMap = path.join(outDir, `${alias}.js.map`);

        // 缓存命中检查
        if (
            cached &&
            cached.fingerprint === fingerprint &&
            fs.existsSync(outputFile) &&
            fs.existsSync(outputMap)
        ) {
            skipped.push(alias);
            continue;
        }

        buildTasks.push({alias, entry, fingerprint, srcDir});
    }

    if (buildTasks.length === 0) {
        console.log(`[prebundle] all modules cached, skipped=${skipped.length}`);
        return;
    }

    // 第二阶段：并行构建
    console.log(`[prebundle] building ${buildTasks.length} modules (concurrency: ${MAX_CONCURRENT_BUILD})...`);
    const startTime = Date.now();
    
    const buildResults = await runConcurrentBuilds(buildTasks);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[prebundle] build time: ${elapsed}s`);

    // 第三阶段：更新 manifest 和统计
    const updated = [];
    const failed = [];

    for (const {alias, result, fingerprint, srcDir, entry} of buildResults) {
        if (result.ok) {
            manifest[alias] = {
                fingerprint,
                builtAt: Date.now(),
                srcDir,
                entry: path.relative(projectRoot, entry),
            };
            updated.push(alias);
        } else {
            failed.push({alias, error: result.error});
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

main().catch((err) => {
    console.error("[prebundle] fatal error:", err);
    process.exit(1);
});