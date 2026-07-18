const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'ip-transit.html',
  'ddos-protection.html',
  'wavelengths.html',
  'cloud-connectivity.html',
  'colocation.html',
  'managed-noc.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`Validation Failed: File ${file} does not exist!`);
    process.exit(1);
  }
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Check CSS link
  if (!html.includes('href="index.css"')) {
    console.error(`Validation Failed: ${file} is missing index.css reference!`);
    process.exit(1);
  }
  
  // Check Header and Footer existence
  if (!html.includes('class="logo"') || !html.includes('class="footer"')) {
    console.error(`Validation Failed: ${file} is missing standard header or footer structure!`);
    process.exit(1);
  }
  
  // Check absolute-style navigation linking
  if (file !== 'index.html' && !html.includes('href="index.html#solutions"')) {
    console.error(`Validation Failed: ${file} does not have home-relative navigation links!`);
    process.exit(1);
  }
});
console.log("All pages validated successfully!");
