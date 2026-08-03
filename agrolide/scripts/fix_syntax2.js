const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/\\(public\\)/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace ",,\n  alternates:" or ",, \n  alternates:" with ",\n  alternates:"
  content = content.replace(/",,\r?\n\s*alternates:/g, '",\n  alternates:');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed syntax in ' + file);
  }
});
