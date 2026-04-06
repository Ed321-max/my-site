import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const databases = [
  { id: process.env.NOTION_PORTFOLIO_DB_ID, prefix: 'portfolio' },
  { id: process.env.NOTION_BLOG_DB_ID, prefix: 'blog' },
  { id: process.env.NOTION_JOURNAL_DB_ID, prefix: 'journal' },
];

const outDir = 'public/images/covers';
await mkdir(outDir, { recursive: true });

async function notionQuery(databaseId) {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({ page_size: 100 }),
  });
  if (!res.ok) throw new Error(`Notion API ${res.status}: ${await res.text()}`);
  return res.json();
}

for (const db of databases) {
  if (!db.id) continue;
  const data = await notionQuery(db.id);

  for (const page of data.results) {
    const slug = page.properties?.Slug?.rich_text?.[0]?.plain_text || page.id;

    const coverProp = page.properties?.Cover;
    const coverFile = coverProp?.files?.[0];
    if (!coverFile) continue;

    const url = coverFile.type === 'file'
      ? coverFile.file.url
      : coverFile.external?.url;
    if (!url) continue;

    const filename = `${db.prefix}-${slug}.webp`;
    const filepath = path.join(outDir, filename);

    console.log(`Downloading: ${filename}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`  Failed: ${response.status} ${filename}`);
      continue;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(filepath, buffer);
  }
}

console.log('All covers downloaded.');
