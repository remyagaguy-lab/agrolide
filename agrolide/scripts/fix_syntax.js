const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync('src/app/\\(public\\)/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Fix the canonical syntax error
  // Sometimes it's "\n,\n  alternates:", sometimes "\r\n,\r\n  alternates:"
  content = content.replace(/\r?\n,\r?\n\s+alternates:/g, ',\n  alternates:');
  
  // Also check if there's any single newline with comma, just in case
  content = content.replace(/\r?\n\s*,\r?\n\s*alternates:/g, ',\n  alternates:');

  if (file.includes('blog') && file.includes('[slug]') && file.includes('page.tsx')) {
    // Fix the similarArticles block
    content = content.replace(
      /(\/\/ Fetch similar articles\s+)similarArticles = await/g,
      '$1let similarArticles: any[] = [];\n  try {\n    similarArticles = await'
    );
    // Wait, the closing brace is on line 100.
    // Actually, instead of regexing this, I'll just replace the specific broken part.
    // Let's replace the broken block exactly.
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed syntax in ${file}`);
  }
});
