import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDir = path.join(process.cwd(), 'src', 'app');
const results = [];

walkDir(targetDir, (filePath) => {
  if (!filePath.endsWith('page.tsx')) return;

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract title
  const titleRegex = /title:\s*(['"`])(.*?)\1/;
  const titleMatch = content.match(titleRegex);
  let title = titleMatch ? titleMatch[2] : null;
  
  // Extract h1
  // This is a naive regex for h1, it might span multiple lines
  const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/i;
  const h1Match = content.match(h1Regex);
  let h1 = h1Match ? h1Match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : null;
  
  // If no title is found, try to look for absolute title
  if (!title) {
    const absRegex = /title:\s*\{\s*absolute:\s*(['"`])(.*?)\1\s*\}/;
    const absMatch = content.match(absRegex);
    if (absMatch) title = absMatch[2];
  }

  // Determine route path from filePath
  const relPath = path.relative(targetDir, filePath).replace(/\\/g, '/');
  
  results.push({
    route: relPath,
    title: title || 'N/A',
    h1: h1 || 'N/A'
  });
});

console.log("=== COMPARAISON TITRE vs H1 ===");
results.forEach(r => {
  console.log(`Route: /${r.route.replace('/page.tsx', '').replace('page.tsx', '')}`);
  console.log(`Titre Meta : ${r.title}`);
  console.log(`Titre H1   : ${r.h1}`);
  console.log('---');
});
