const fs = require('fs');
const path = require('path');

const buildDir = 'dist/build';
const rootIndex = path.join(buildDir, 'index.html');
const h5Index = path.join(buildDir, 'h5', 'index.html');

const indexPath = fs.existsSync(rootIndex) ? rootIndex
               : fs.existsSync(h5Index) ? h5Index
               : null;

if (!indexPath) {
  console.error('ERROR: index.html not found in dist/build/ or dist/build/h5/');
  console.error('Searching recursively...');
  const files = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'index.html') files.push(full);
    }
  }
  walk(buildDir);
  if (files.length === 0) {
    console.error('FATAL: no index.html found anywhere under dist/build/');
    process.exit(1);
  }
  console.error('Found at:', files.join(', '));
  // Use the first one found
  files.forEach(f => fixFile(f));
  process.exit(0);
}

fixFile(indexPath);

function fixFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;
  // Only fix href/src attribute values starting with "/assets/"
  html = html.replace(/(href|src)="\/assets\//g, '$1"/idiom-quiz-game/assets/');
  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Paths fixed in ${filePath} ✓`);
  } else {
    console.log(`No paths needed fixing in ${filePath}`);
  }
}
