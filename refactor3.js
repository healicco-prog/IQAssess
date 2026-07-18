const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/App.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Add State variables
// 1. MCQ Builder
if (!content.includes('const [mcqBuilderInstitution, setMcqBuilderInstitution] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[mcqBuilderCourse, setMcqBuilderCourse\] = useState<string>\('AP Biology'\);/,
    "const [mcqBuilderInstitution, setMcqBuilderInstitution] = useState<string>('');\n  const [mcqBuilderCourse, setMcqBuilderCourse] = useState<string>('AP Biology');"
  );
}

// 2. Blueprint Builder
if (!content.includes('const [bpdsInstitution, setBpdsInstitution] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[bpdsCourse, setBpdsCourse\] = useState<string>\('Medicine'\);/,
    "const [bpdsInstitution, setBpdsInstitution] = useState<string>('');\n  const [bpdsCourse, setBpdsCourse] = useState<string>('Medicine');"
  );
}

// 3. Assessment DS (adsInstitution is currently used for course! I'll rename the state variable logic)
if (!content.includes('const [adsActualInstitution, setAdsActualInstitution] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[adsInstitution, setAdsInstitution\] = useState<string>\('MBBS 3rd Batch'\);/,
    "const [adsActualInstitution, setAdsActualInstitution] = useState<string>('');\n  const [adsInstitution, setAdsInstitution] = useState<string>('MBBS 3rd Batch');"
  );
}

// 4. Rubrics DS
if (!content.includes('const [newRubricInstitution, setNewRubricInstitution] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[newRubricCourse, setNewRubricCourse\] = useState<string>\(''\);/,
    "const [newRubricInstitution, setNewRubricInstitution] = useState<string>('');\n  const [newRubricCourse, setNewRubricCourse] = useState<string>('');"
  );
}

// Replace UIs using regex
// 5. MCQ Builder UI
const mcqRegex = /<div className="grid grid-cols-1 md:grid-cols-3 gap-3">\s*<div>\s*<label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\s*Course \/ Programme[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(mcqRegex, `<div className="grid grid-cols-1 gap-3 col-span-full">\n<CurriculumSelectors institution={mcqBuilderInstitution} setInstitution={setMcqBuilderInstitution} course={mcqBuilderCourse} setCourse={setMcqBuilderCourse} subject={mcqBuilderSubject} setSubject={setMcqBuilderSubject} topic={mcqBuilderTopic} setTopic={setMcqBuilderTopic} isDarkMode={isDarkMode} />\n</div>`);

// 6. Assessment DS UI
const adsRegex = /\{\/\* Parameter 4: Course \/ Programme \*\/\}\s*<div>\s*<label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\s*Course \/ Programme[\s\S]*?\{\/\* Parameter 5 & 6: Subject Name \* & Topic \/ Theme \*\/\}\s*<div className="grid grid-cols-1 gap-3">\s*<div>\s*<label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">\s*Subject Name[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(adsRegex, `\n<CurriculumSelectors institution={adsActualInstitution} setInstitution={setAdsActualInstitution} course={adsInstitution} setCourse={setAdsInstitution} subject={adsSubject} setSubject={setAdsSubject} topic={adsTopic} setTopic={setAdsTopic} isDarkMode={isDarkMode} />\n`);

// 7. Blueprint Builder UI
const bpdsRegex = /<div className="grid grid-cols-1 md:grid-cols-3 gap-3">\s*<div>\s*<label className="block text-\[10px\] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400 mb-1">Course \/ Programme[\s\S]*?<div>\s*<label className="block text-\[10px\] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400 mb-1">Subject Name[\s\S]*?<\/div>\s*<\/div>/;
// Wait, Blueprint doesn't have Topic! It just has Course, Year, Subject.
// In this case, we can pass `topic` as undefined, but CurriculumSelectors requires a topic state or it will crash.
// I'll add `bpdsTopic` state.
if (!content.includes('const [bpdsTopic, setBpdsTopic] = useState<string>(\'\');')) {
  content = content.replace(
    /const \[bpdsSubject, setBpdsSubject\] = useState<string>\('Clinical & Health Law'\);/,
    "const [bpdsSubject, setBpdsSubject] = useState<string>('Clinical & Health Law');\n  const [bpdsTopic, setBpdsTopic] = useState<string>('');"
  );
}
content = content.replace(bpdsRegex, `<div className="col-span-full">\n<CurriculumSelectors institution={bpdsInstitution} setInstitution={setBpdsInstitution} course={bpdsCourse} setCourse={setBpdsCourse} subject={bpdsSubject} setSubject={setBpdsSubject} topic={bpdsTopic} setTopic={setBpdsTopic} isDarkMode={isDarkMode} />\n</div>`);

// 8. Rubrics DS UI
const rubricRegex = /<div>\s*<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">\s*Course \/ Programme[\s\S]*?<div>\s*<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">\s*Topic \/ Theme[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(rubricRegex, `<div className="col-span-full">\n<CurriculumSelectors institution={newRubricInstitution} setInstitution={setNewRubricInstitution} course={newRubricCourse} setCourse={setNewRubricCourse} subject={newRubricSubject} setSubject={setNewRubricSubject} topic={newRubricTopic} setTopic={setNewRubricTopic} isDarkMode={isDarkMode} />\n</div>`);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Refactoring 2 completed');
