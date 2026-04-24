#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src');

// 匹配 JSX 语法的正则
const jsxPattern = /<[A-Z][a-zA-Z0-9]*[\s/>]|<[a-z]+[\s/>]/;

// 查找所有 .js 文件
function findJsFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            files.push(...findJsFiles(fullPath));
        } else if (item.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

// 检查文件是否包含 JSX
function hasJsx(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return jsxPattern.test(content);
}

// 重命名文件并更新引用
function renameToJsx(filePath) {
    const dir = path.dirname(filePath);
    const oldName = path.basename(filePath);
    const newName = oldName.replace(/\.js$/, '.jsx');
    const newPath = path.join(dir, newName);

    // 重命名文件
    fs.renameSync(filePath, newPath);
    console.log(`Renamed: ${filePath} -> ${newPath}`);

    return { oldPath: filePath, newPath, oldName, newName };
}

// 更新所有文件中的 import 引用
function updateImports(renamedFiles) {
    const allFiles = findJsFiles(srcDir).concat(
        findJsFiles(srcDir).map(f => f.replace(/\.js$/, '.jsx')).filter(f => fs.existsSync(f))
    );

    // 建立映射关系
    const nameMap = new Map();
    for (const { oldName, newName } of renamedFiles) {
        nameMap.set(oldName, newName);
    }

    let updatedCount = 0;

    for (const file of allFiles) {
        if (!fs.existsSync(file)) continue;

        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        for (const [oldName, newName] of nameMap) {
            // 匹配 import 语句中的 .js 引用
            const importPattern = new RegExp(`(from\\s+['"][^'"]*)${oldName}(['"])`, 'g');
            if (importPattern.test(content)) {
                content = content.replace(importPattern, `$1${newName}$2`);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            updatedCount++;
        }
    }

    return updatedCount;
}

// 主函数
function main() {
    console.log('Scanning .js files...');
    const jsFiles = findJsFiles(srcDir);
    console.log(`Found ${jsFiles.length} .js files`);

    console.log('Detecting JSX syntax...');
    const jsxFiles = jsFiles.filter(hasJsx);
    console.log(`Found ${jsxFiles.length} files with JSX syntax`);

    if (jsxFiles.length === 0) {
        console.log('No files to rename.');
        return;
    }

    console.log('Renaming files...');
    const renamedFiles = [];
    for (const file of jsxFiles) {
        try {
            renamedFiles.push(renameToJsx(file));
        } catch (err) {
            console.error(`Failed to rename ${file}: ${err.message}`);
        }
    }

    console.log(`Renamed ${renamedFiles.length} files`);

    console.log('Updating imports...');
    const updatedCount = updateImports(renamedFiles);
    console.log(`Updated imports in ${updatedCount} files`);

    console.log('Done!');
}

main();