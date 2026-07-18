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

for (const form of forms) {
  const regex = new RegExp(`const \\[${form}, set${form.charAt(0).toUpperCase() + form.slice(1)}\\] = useState\\({([^}]*)className:`, 'g');
  content = content.replace(regex, `const [${form}, set${form.charAt(0).toUpperCase() + form.slice(1)}] = useState({$1institution: '', className:`);
}

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
}

// 3. Add to Dashboard
if (!content.includes('<CurriculumManager />')) {
  content = content.replace(
    /\{\/\* DYNAMIC LISTING OF THE TIER-SPECIFIC IDASSESS FEATURES \*\/\}/,
    "<div className=\"mb-10\"><CurriculumManager /></div>\n\n              {/* DYNAMIC LISTING OF THE TIER-SPECIFIC IDASSESS FEATURES */}"
  );
}

// Add individual state variables
// MCQ Builder
if (!content.includes('const [mcqBuilderInstitution, setMcqBuilderInstitution] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[mcqBuilderCourse, setMcqBuilderCourse\] = useState<string>\('AP Biology'\);/,
    "const [mcqBuilderInstitution, setMcqBuilderInstitution] = useState<string>('');\n  const [mcqBuilderCourse, setMcqBuilderCourse] = useState<string>('AP Biology');"
  );
}

// Blueprint Builder
if (!content.includes('const [bpdsInstitution, setBpdsInstitution] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[bpdsCourse, setBpdsCourse\] = useState<string>\('Medicine'\);/,
    "const [bpdsInstitution, setBpdsInstitution] = useState<string>('');\n  const [bpdsCourse, setBpdsCourse] = useState<string>('Medicine');"
  );
}

// Assessment DS
if (!content.includes('const [adsActualInstitution, setAdsActualInstitution] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[adsInstitution, setAdsInstitution\] = useState<string>\('MBBS 3rd Batch'\);/,
    "const [adsActualInstitution, setAdsActualInstitution] = useState<string>('');\n  const [adsInstitution, setAdsInstitution] = useState<string>('MBBS 3rd Batch');"
  );
}

// Rubrics DS
if (!content.includes('const [newRubricInstitution, setNewRubricInstitution] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[newRubricCourse, setNewRubricCourse\] = useState<string>\(''\);/,
    "const [newRubricInstitution, setNewRubricInstitution] = useState<string>('');\n  const [newRubricCourse, setNewRubricCourse] = useState<string>('');"
  );
}

// Add bpdsTopic for Blueprint Builder
if (!content.includes('const [bpdsTopic, setBpdsTopic] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[bpdsSubject, setBpdsSubject\] = useState<string>\('Clinical & Health Law'\);/,
    "const [bpdsSubject, setBpdsSubject] = useState<string>('Clinical & Health Law');\n  const [bpdsTopic, setBpdsTopic] = useState<string>('');"
  );
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('State variables added successfully.');
