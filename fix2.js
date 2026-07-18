const fs = require('fs');

let code = fs.readFileSync('frontend/src/components/BlueprintAssessor.tsx', 'utf-8');
code = code.replace(/getDashboardSetting\('institution'\)/g, "getDashboardSetting('institution', '')");
code = code.replace(/getDashboardSetting\('course'\)/g, "getDashboardSetting('course', '')");
code = code.replace(/getDashboardSetting\('subject'\)/g, "getDashboardSetting('subject', '')");
fs.writeFileSync('frontend/src/components/BlueprintAssessor.tsx', code);
console.log('Fixed BlueprintAssessor settings');

let appCode = fs.readFileSync('frontend/src/App.tsx', 'utf-8');
appCode = appCode.replace(/rubricBuilderTopic/g, "'Rubric'");
fs.writeFileSync('frontend/src/App.tsx', appCode);
console.log('Fixed App settings');
