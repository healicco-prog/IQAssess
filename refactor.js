const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/App.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Imports
if (!content.includes('CurriculumManager')) {
  content = content.replace(
    "import { HistoryInput } from './components/HistoryInput';",
    "import { HistoryInput } from './components/HistoryInput';\nimport { CurriculumManager } from './components/CurriculumManager';\nimport { CurriculumSelectors } from './components/CurriculumSelectors';"
  );
}

// 2. Add institution to forms
const forms = [
  'essayForm',
  'mcqForm',
  'reflectionForm',
  'rubricBuilderForm',
  'bpBuilderForm',
  'assessorConfigForm',
  'itemAnalysisForm'
];

let replacedForms = 0;
for (const form of forms) {
  const regex = new RegExp(`const \\[${form}, set${form.charAt(0).toUpperCase() + form.slice(1)}\\] = useState\\({([^}]*)className:`, 'g');
  const count = (content.match(regex) || []).length;
  if (count > 0) {
    content = content.replace(regex, `const [${form}, set${form.charAt(0).toUpperCase() + form.slice(1)}] = useState({$1institution: '', className:`);
    replacedForms += count;
  }
}
console.log(`Replaced ${replacedForms} form definitions.`);

// customPaperForm
if (content.includes('const [customPaperForm, setCustomPaperForm] = useState<{')) {
  content = content.replace(
    /const \[customPaperForm, setCustomPaperForm\] = useState<\s*\{\s*name: string;\s*date: string;\s*className: string;/,
    "const [customPaperForm, setCustomPaperForm] = useState<{\n    institution: string;\n    name: string;\n    date: string;\n    className: string;"
  );
  content = content.replace(
    /name: 'Mock Test - Fluid Mechanics',\n\s*date: new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\],\n\s*className:/,
    "name: 'Mock Test - Fluid Mechanics',\n    date: new Date().toISOString().split('T')[0],\n    institution: '',\n    className:"
  );
  console.log("Replaced customPaperForm definition.");
}

// 3. Add to Dashboard
if (!content.includes('<CurriculumManager />')) {
  content = content.replace(
    /\{\/\* DYNAMIC LISTING OF THE TIER-SPECIFIC IDASSESS FEATURES \*\/\}/,
    "<div className=\"mb-10\"><CurriculumManager /></div>\n\n              {/* DYNAMIC LISTING OF THE TIER-SPECIFIC IDASSESS FEATURES */}"
  );
  console.log("Added CurriculumManager to Dashboard.");
}

// 4. Replace Form UI
const replaceUI = (formName, regexStr) => {
  const regex = new RegExp(regexStr);
  if (regex.test(content)) {
    content = content.replace(regex, `<CurriculumSelectors formState={${formName}} setFormState={set${formName.charAt(0).toUpperCase() + formName.slice(1)}} isDarkMode={isDarkMode} />`);
    console.log(`Replaced UI for ${formName}`);
  } else {
    console.log(`Failed to find UI for ${formName}`);
  }
};

// Paper AS
replaceUI('customPaperForm', '<div className="space-y-1\\.5">\\s*<label className="text-slate-600 dark:text-slate-300 block">Course \/ Programme[\\s\\S]*?(?:<div className="space-y-1\\.5 text-xs font-semibold">\\s*<label className="text-slate-600 dark:text-slate-300 block">Topic \\/ Theme<\\/label>[\\s\\S]*?<\\/div>|<div className="space-y-1\\.5 text-xs font-semibold">\\s*<label className="text-slate-600 dark:text-slate-300 block">System\\/ Chapter\\/ Topic Details:<\\/label>[\\s\\S]*?<\\/div>)');

// Essay AS
replaceUI('essayForm', '<div>\\s*<label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\\s*Course \\/ Programme[\\s\\S]*?<div>\\s*<label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\\s*Topic \\/ Theme[\\s\\S]*?<\\/div>');

// MCQ AS
replaceUI('mcqForm', '<div>\\s*<label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\\s*Course \\/ Programme[\\s\\S]*?<div>\\s*<label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\\s*Topic \\/ Theme[\\s\\S]*?<\\/div>');

// Reflection AS
replaceUI('reflectionForm', '<div>\\s*<label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\\s*Course \\/ Programme[\\s\\S]*?<div>\\s*<label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\\s*Topic \\/ Theme[\\s\\S]*?<\\/div>');


fs.writeFileSync(filePath, content, 'utf-8');
console.log('Refactoring saved');
