const fs = require('fs');
const content = fs.readFileSync('backend/server.ts', 'utf-8');
const firstIdx = content.indexOf('app.post("/api/ai/assess-blueprint-compliance"');
if (firstIdx === -1) {
    console.error('First route not found');
    process.exit(1);
}
const endString = 'res.json(simulatedResult);\r\n});';
let endIdx = content.indexOf(endString, firstIdx);
let len = endString.length;

if (endIdx === -1) {
    const endString2 = 'res.json(simulatedResult);\n});';
    endIdx = content.indexOf(endString2, firstIdx);
    len = endString2.length;
}

if (endIdx === -1) {
    console.error('End of route not found');
    process.exit(1);
}

const newContent = content.slice(0, firstIdx) + content.slice(endIdx + len);
fs.writeFileSync('backend/server.ts', newContent);
console.log('Successfully removed duplicate route');
