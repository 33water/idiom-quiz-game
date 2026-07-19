const fs = require('fs');
const path = 'dist/build/index.html';
let html = fs.readFileSync(path, 'utf8');
// Only fix href/src attribute values (no double-replacement risk)
html = html.replace(/(href|src)="\/assets\//g, '$1"/idiom-quiz-game/assets/');
fs.writeFileSync(path, html, 'utf8');
console.log('Paths fixed ✓');
