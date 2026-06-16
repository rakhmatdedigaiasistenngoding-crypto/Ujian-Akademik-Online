const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../Dokumen_Pendukung/Bank Soal PBO');
const file = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'))[0];
const content = fs.readFileSync(path.join(dirPath, file), 'utf8');

const regex = /\d+\.\s*\*\*(.*?)\*\*(.*?)\*\*Kunci:\s*([A-E])\*\*/gs;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  if (count === 1) {
    console.log("Q1:", match[1].trim());
    console.log("OptBlock:", match[2]);
    console.log("Key:", match[3]);
  }
}
console.log("Total matched in file 1:", count);
