import fs from 'fs';
import path from 'path';

const forbidden = [
  'console.log(req.body)',
  'console.log(body)',
  'console.log(payload)',
];

function scanDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      forbidden.forEach(pattern => {
        if (content.includes(pattern)) {
          console.error(PII Risk in: );
          process.exit(1);
        }
      });
    }
  }
}

scanDir('./app');
console.log('PII scan passed');
