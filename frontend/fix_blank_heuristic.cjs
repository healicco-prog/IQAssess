const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `      const isBlankTemplate = fileNameStr.includes('omr_sheet_') || fileNameStr === 'omr sheet.jpg' || fileNameStr.includes('template');`;
const replacementStr = `      const isSameAsTemplate = omrTemplateFile && studentMcqFile?.name === omrTemplateFile.name && studentMcqFile?.size === omrTemplateFile.size;
      const isBlankTemplate = fileNameStr.includes('omr_sheet_') || fileNameStr === 'omr sheet.jpg' || fileNameStr.includes('template') || fileNameStr.includes('blank') || isSameAsTemplate;`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content);
  console.log("Updated isBlankTemplate heuristic successfully.");
} else {
  console.log("Could not find target string.");
}
