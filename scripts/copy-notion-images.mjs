import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import path from 'path';

const srcDir = 'src/assets/images/notion';
const outDir = 'public/images/notion';

mkdirSync(outDir, { recursive: true });

function copyFiles(src, dest) {
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    if (entry.isDirectory()) {
      copyFiles(srcPath, dest);
    } else {
      copyFileSync(srcPath, path.join(dest, entry.name));
    }
  }
}

if (!existsSync(srcDir)) {
  console.log('No notion images source directory');
  process.exit(0);
}

copyFiles(srcDir, outDir);

// Count files
let count = 0;
const allFiles = readdirSync(outDir, { withFileTypes: true });
for (const f of allFiles) {
  if (f.isFile()) count++;
  else {
    const sub = readdirSync(path.join(outDir, f.name));
    count += sub.filter(x => !x.startsWith('.')).length;
  }
}
console.log(`Notion images copied: ${count} files to public/images/notion/`);
