const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");
const fs = require("fs");

const projectPath = path.join(__dirname, '..');
const project = new Project({
  tsConfigFilePath: path.join(projectPath, "tsconfig.json"),
});

const sourceFiles = project.getSourceFiles();
let totalQueries = 0;
let fileQueries = {};

sourceFiles.forEach(sourceFile => {
  const filePath = sourceFile.getFilePath();
  // ignore node_modules and .next
  if (filePath.includes('node_modules') || filePath.includes('.next')) return;
  
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  
  calls.forEach(call => {
    const expression = call.getExpression();
    if (expression.getKind() === SyntaxKind.PropertyAccessExpression) {
      const propAccess = expression;
      if (propAccess.getName() === 'from') {
        const caller = propAccess.getExpression();
        if (caller.getText() === 'supabase' || caller.getText().includes('supabase')) {
          
          let highestCall = call;
          let parent = call.getParent();
          while (parent && parent.getKind() === SyntaxKind.PropertyAccessExpression) {
            const nextCall = parent.getParent();
            if (nextCall && nextCall.getKind() === SyntaxKind.CallExpression) {
              highestCall = nextCall;
              parent = nextCall.getParent();
            } else {
              break;
            }
          }
          
          const relativePath = path.relative(projectPath, filePath);
          if (!fileQueries[relativePath]) fileQueries[relativePath] = [];
          fileQueries[relativePath].push(highestCall.getText());
          totalQueries++;
        }
      }
    }
  });
});

fs.writeFileSync(path.join(projectPath, "queries-list.json"), JSON.stringify(fileQueries, null, 2));
console.log(`Total queries found: ${totalQueries}. Exported to queries-list.json`);
