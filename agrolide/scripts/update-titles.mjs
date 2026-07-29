import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDir = path.join(process.cwd(), 'src', 'app');

walkDir(targetDir, (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Change root layout
  if (filePath.endsWith('layout.tsx') && content.includes('template:')) {
    const newContent = content.replace(
      /title:\s*\{\s*default:\s*['"`].*?['"`],\s*template:\s*['"`].*?['"`]\s*\}/,
      "title: { default: 'Accueil | Réseau agrolide', template: '%s | Réseau agrolide' }"
    );
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }

  // General title replacement
  // Matches `title: 'Something | Agrolide'` or `title: "Something | agrolide"`
  const titleRegex = /title:\s*(['"`])(.*?)(?:\s*\|\s*[aA]grolide(?:[^'"`]*))?\1/g;
  
  content = content.replace(titleRegex, (match, quote, titleText) => {
    // If it's already just the name, keep it. 
    // If it has " | Agrolide", titleText will be just the first part because of the non-capturing group.
    
    // Special case for Incubation agrolide | Accélérateur...
    if (titleText.includes('Incubation agrolide')) {
      titleText = 'Incubation';
    }
    
    // Special case for Dashboard Admin | agrolide -> Dashboard Admin
    if (titleText.includes(' | Admin agrolide')) {
      titleText = titleText.replace(' | Admin agrolide', '');
    }

    // Special case for absolute title in home page
    // but the regex won't match `title: { absolute: "..." }` easily if we don't account for absolute.
    return `title: "${titleText.trim()}"`;
  });

  // Handle absolute title
  const absoluteTitleRegex = /title:\s*\{\s*absolute:\s*['"`](.*?)['"`]\s*\}/g;
  content = content.replace(absoluteTitleRegex, (match, absoluteText) => {
    return `title: "Accueil"`; // home page
  });
  
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
});
